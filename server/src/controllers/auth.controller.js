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
// PRIMARY CREDENTIALS VERIFICATION
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
      userAgent: req.headers['user-agent'] || 'unknown',
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
        userAgent: req.headers['user-agent'] || 'unknown',
      });
    }

    await admin.save({ validateBeforeSave: false });

    await AuditLog.logEvent({
      adminId: admin._id,
      emailAttempted: email,
      action: 'LOGIN_FAILED',
      status,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
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
// GENERATE 2FA PROVISIONING PAYLOAD
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
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  res.status(200).json({
    status: 'success',
    qrCode: qrCodeDataUrl,
    manualSecret: secret.base32,
  });
});

// =========================================
// VERIFY 2FA PASSCODE & EMIT SESSION
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

  const delta = speakeasy.totp.verifyDelta({
    secret: activeSecret,
    encoding: 'base32',
    token: cleanCode,
    window: 4,
  });

  if (!delta) {
    await AuditLog.logEvent({
      adminId: admin._id,
      action: '2FA_FAILED',
      status: 'WARNING',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
    });
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired authentication code.',
    });
  }

  if (!admin.is2faEnabled) {
    admin.twoFactorSecret = admin.tempTwoFactorSecret || admin.twoFactorSecret;
    admin.tempTwoFactorSecret = undefined;
    admin.is2faEnabled = true;

    await AuditLog.logEvent({
      adminId: admin._id,
      action: '2FA_SETUP_COMPLETED',
      status: 'SUCCESS',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
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
    userAgent: req.headers['user-agent'] || 'unknown',
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
// RESET 2FA FOR RE-ENROLLMENT
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
// SILENT REFRESH TOKEN ROTATION
// =========================================
export const refreshToken = catchAsync(async (req, res, next) => {
  const cookieHeader = req.cookies?.sihm_session;

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
      userAgent: req.headers['user-agent'] || 'unknown',
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
// TERMINATE SESSION
// =========================================
export const logout = catchAsync(async (req, res, next) => {
  const cookieHeader = req.cookies?.sihm_session;

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
          userAgent: req.headers['user-agent'] || 'unknown',
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