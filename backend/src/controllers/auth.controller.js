import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import Admin from '../models/admin.model.js';
import Session from '../models/session.model.js';
import AuditLog from '../models/auditlog.model.js';
import catchAsync from '../utils/catchAsync.js';
import {
  generatePreAuthToken,
  generateAccessToken,
  generateRefreshToken,
  setSessionCookie,
  clearSessionCookie,
} from '../utils/auth.util.js';

// =========================================
// 1. PROVISION ADMINISTRATOR (SuperAdmin Only)
// =========================================
export const createAdmin = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email and temporary password are required.',
    });
  }

  const assignedRole = role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({
      status: 'fail',
      message: 'An administrative account with this email already exists.',
    });
  }

  const newAdmin = await Admin.create({
    email,
    password,
    role: assignedRole,
  });

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'ADMIN_PROVISIONED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: { provisionedEmail: email, provisionedRole: assignedRole },
  });

  res.status(201).json({
    status: 'success',
    message: `${assignedRole} account provisioned. They must complete 2FA on initial login.`,
    user: {
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
    },
    admin: {
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
    },
  });
});

// =========================================
// 2. PRIMARY CREDENTIALS VERIFICATION
// =========================================
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide both administrative identifier and passphrase.',
    });
  }

  const admin = await Admin.findOne({ email }).select('+password +twoFactorSecret');

  if (!admin) {
    await AuditLog.logEvent({
      emailAttempted: email,
      action: 'LOGIN_FAILED',
      status: 'FAILURE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid administrative credentials.',
    });
  }

  if (admin.isAccountLocked()) {
    return res.status(403).json({
      status: 'fail',
      message: 'Account is temporarily locked due to repeated authentication failures.',
    });
  }

  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    admin.failedLoginAttempts += 1;
    let status = 'FAILURE';

    if (admin.failedLoginAttempts >= 5) {
      admin.lockUntil = Date.now() + 15 * 60 * 1000;
      status = 'CRITICAL';
      await AuditLog.logEvent({
        adminId: admin._id,
        emailAttempted: email,
        action: 'ACCOUNT_LOCKED',
        status,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    await admin.save({ validateBeforeSave: false });

    await AuditLog.logEvent({
      adminId: admin._id,
      emailAttempted: email,
      action: 'LOGIN_FAILED',
      status,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid administrative credentials.',
    });
  }

  admin.failedLoginAttempts = 0;
  admin.lockUntil = undefined;
  await admin.save({ validateBeforeSave: false });

  const preAuthToken = generatePreAuthToken(admin._id);

  res.status(200).json({
    status: 'success',
    message: 'Primary credentials accepted. Proceed to multi-factor verification.',
    is2faEnabled: admin.is2faEnabled,
    preAuthToken,
  });
});

// =========================================
// 3. GENERATE 2FA PROVISIONING PAYLOAD
// =========================================
export const setup2FA = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.user._id).select(
    '+twoFactorSecret +tempTwoFactorSecret'
  );

  const secret = speakeasy.generateSecret({
    length: 20,
    name: `SIHM Portal (${admin.email})`,
    issuer: 'SIHM Portal',
  });

  // CRITICAL FIX: Explicitly generate Base32 otpauth URL so Microsoft Authenticator
  // and Speakeasy verify with the exact same Base32 encoding.
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `SIHM Portal (${admin.email})`,
    issuer: 'SIHM Portal',
    encoding: 'base32',
  });

  admin.tempTwoFactorSecret = secret.base32;
  await admin.save({ validateBeforeSave: false });

  const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

  await AuditLog.logEvent({
    adminId: admin._id,
    action: '2FA_SETUP_INITIATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res.status(200).json({
    status: 'success',
    qrCode: qrCodeDataUrl,
    manualSecret: secret.base32,
  });
});

// =========================================
// 4. VERIFY 2FA PASSCODE & EMIT SESSION
// =========================================
export const verify2FA = catchAsync(async (req, res, next) => {
  const { totpCode } = req.body;
  const admin = await Admin.findById(req.user._id).select(
    '+twoFactorSecret +tempTwoFactorSecret'
  );

  const cleanCode = String(totpCode || '').trim();

  if (!cleanCode || cleanCode.length !== 6) {
    return res.status(400).json({
      status: 'fail',
      message: 'A complete 6-digit rolling passcode is required.',
    });
  }

  const activeSecret = admin.twoFactorSecret || admin.tempTwoFactorSecret;

  if (!activeSecret) {
    return res.status(400).json({
      status: 'fail',
      message: 'Two-factor setup has not been initialized for this account.',
    });
  }

  // --- DIAGNOSTIC TELEMETRY (Check terminal output) ---
  const currentExpected = speakeasy.totp({
    secret: activeSecret,
    encoding: 'base32',
  });
  console.log('====== [SIHM 2FA DIAGNOSTIC] ======');
  console.log('Account Email     :', admin.email);
  console.log('User Entered TOTP :', cleanCode);
  console.log('Server Expected   :', currentExpected);
  console.log('Server Time (UTC) :', new Date().toISOString());
  console.log('Secret (Prefix)   :', activeSecret.substring(0, 6) + '...');

  // Use verifyDelta with window: 4 (permits up to ±120s of clock difference)
  const delta = speakeasy.totp.verifyDelta({
    secret: activeSecret,
    encoding: 'base32',
    token: cleanCode,
    window: 4,
  });

  console.log('Validation Delta  :', delta ? delta.delta : 'FAILED (null)');
  console.log('====================================');

  if (!delta) {
    await AuditLog.logEvent({
      adminId: admin._id,
      action: '2FA_FAILED',
      status: 'WARNING',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired authentication code.',
    });
  }

  // Promote temporary secret to permanent on successful verification
  if (!admin.is2faEnabled) {
    admin.twoFactorSecret = admin.tempTwoFactorSecret || admin.twoFactorSecret;
    admin.tempTwoFactorSecret = undefined;
    admin.is2faEnabled = true;

    await AuditLog.logEvent({
      adminId: admin._id,
      action: '2FA_SETUP_COMPLETED',
      status: 'SUCCESS',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  admin.lastLogin = Date.now();
  await admin.save({ validateBeforeSave: false });

  const plainRefreshToken = generateRefreshToken();

  const newSession = await Session.create({
    adminId: admin._id,
    refreshToken: plainRefreshToken,
    userAgent: req.headers['user-agent'] || 'unknown',
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setSessionCookie(res, newSession._id, plainRefreshToken);
  const accessToken = generateAccessToken(admin._id, admin.role);

  await AuditLog.logEvent({
    adminId: admin._id,
    action: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res.status(200).json({
    status: 'success',
    accessToken,
    user: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
});

// =========================================
// 5. RESET 2FA FOR RE-ENROLLMENT (One-Time Setup Tool)
// =========================================
export const resetMy2FA = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.user._id);
  admin.is2faEnabled = false;
  admin.twoFactorSecret = undefined;
  admin.tempTwoFactorSecret = undefined;
  await admin.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: '2FA reset successfully. You can now scan a clean QR code on next login.',
  });
});

// =========================================
// 6. SILENT REFRESH TOKEN ROTATION
// =========================================
export const refreshToken = catchAsync(async (req, res, next) => {
  const cookieHeader = req.cookies.sihm_session;

  if (!cookieHeader || cookieHeader === 'logged_out') {
    return res.status(401).json({
      status: 'fail',
      message: 'No active session detected.',
    });
  }

  const [sessionId, plainToken] = cookieHeader.split('|');

  if (!sessionId || !plainToken) {
    return res.status(401).json({
      status: 'fail',
      message: 'Malformed session credentials.',
    });
  }

  const session = await Session.findById(sessionId);

  if (!session) {
    return res.status(401).json({
      status: 'fail',
      message: 'Session expired or invalidated.',
    });
  }

  if (!session.isValid) {
    return res.status(403).json({
      status: 'fail',
      message: 'Session revoked by administrative directive.',
    });
  }

  const isTokenValid = await session.compareRefreshToken(plainToken);

  if (!isTokenValid) {
    await Session.deleteMany({ adminId: session.adminId });

    await AuditLog.logEvent({
      adminId: session.adminId,
      action: 'REFRESH_TOKEN_REUSE_DETECTED',
      status: 'CRITICAL',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        reason: 'Mismatched refresh token provided. All sessions revoked for admin.',
      },
    });

    clearSessionCookie(res);
    return res.status(403).json({
      status: 'fail',
      message: 'Security breach detected. All active sessions invalidated.',
    });
  }

  const admin = await Admin.findById(session.adminId);
  if (!admin) {
    await Session.deleteMany({ adminId: session.adminId });
    clearSessionCookie(res);
    return res.status(401).json({
      status: 'fail',
      message: 'Administrator account no longer exists.',
    });
  }

  await Session.findByIdAndDelete(sessionId);

  const newPlainToken = generateRefreshToken();
  const newSession = await Session.create({
    adminId: admin._id,
    refreshToken: newPlainToken,
    userAgent: req.headers['user-agent'] || 'unknown',
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setSessionCookie(res, newSession._id, newPlainToken);
  const newAccessToken = generateAccessToken(admin._id, admin.role);

  res.status(200).json({
    status: 'success',
    accessToken: newAccessToken,
    user: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
});

// =========================================
// 7. TERMINATE SESSION
// =========================================
export const logout = catchAsync(async (req, res, next) => {
  const cookieHeader = req.cookies.sihm_session;

  if (cookieHeader && cookieHeader !== 'logged_out') {
    const [sessionId] = cookieHeader.split('|');
    if (sessionId) {
      const session = await Session.findByIdAndDelete(sessionId);
      if (session) {
        await AuditLog.logEvent({
          adminId: session.adminId,
          action: 'LOGOUT',
          status: 'SUCCESS',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
      }
    }
  }

  clearSessionCookie(res);
  res.status(200).json({
    status: 'success',
    message: 'Session cleanly terminated.',
  });
});