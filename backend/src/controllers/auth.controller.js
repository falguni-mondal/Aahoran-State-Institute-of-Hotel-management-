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



// CREATE NEW ADMIN (SuperAdmin Only)
export const createAdmin = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and temporary password are required.' });
  }

  // Ensure standard admins cannot be elevated to SuperAdmin by mistake
  const assignedRole = role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const newAdmin = await Admin.create({
    email,
    password,
    role: assignedRole,
  });

  // Log the provisioning action for compliance
  await AuditLog.logEvent({
    adminId: req.user._id, // The SuperAdmin who performed the action
    action: 'ADMIN_PROVISIONED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: { provisionedEmail: email, provisionedRole: assignedRole }
  });

  res.status(201).json({
    status: 'success',
    message: `${assignedRole} account created successfully. They must set up 2FA upon first login.`,
    admin: {
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
    }
  });
});


// 1. STEP ONE: VERIFY CREDENTIALS
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find admin and force inclusion of hidden security fields
  const admin = await Admin.findOne({ email }).select('+password +twoFactorSecret');

  if (!admin) {
    await AuditLog.logEvent({
      emailAttempted: email, action: 'LOGIN_FAILED', status: 'FAILURE',
      ipAddress: req.ip, userAgent: req.headers['user-agent']
    });
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check if account is locked
  if (admin.isAccountLocked()) {
    return res.status(403).json({ 
      message: `Account locked due to multiple failed attempts. Try again later.` 
    });
  }

  // Verify Password
  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    admin.failedLoginAttempts += 1;
    let status = 'FAILURE';

    // Lock account if >= 5 failed attempts
    if (admin.failedLoginAttempts >= 5) {
      admin.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      status = 'CRITICAL';
      await AuditLog.logEvent({
        adminId: admin._id, emailAttempted: email, action: 'ACCOUNT_LOCKED', status,
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      });
    }

    await admin.save({ validateBeforeSave: false });
    
    await AuditLog.logEvent({
      adminId: admin._id, emailAttempted: email, action: 'LOGIN_FAILED', status,
      ipAddress: req.ip, userAgent: req.headers['user-agent']
    });
    
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Password is correct: Reset lockout trackers
  admin.failedLoginAttempts = 0;
  admin.lockUntil = undefined;
  await admin.save({ validateBeforeSave: false });

  // Issue Pre-Auth Token (Valid for 5 mins) to proceed to 2FA phase
  const preAuthToken = generatePreAuthToken(admin._id);

  res.status(200).json({
    status: 'success',
    message: 'Credentials verified. Proceed to 2FA.',
    is2faEnabled: admin.is2faEnabled,
    preAuthToken,
  });
});



// 2. GENERATE 2FA QR CODE (First Time Setup)
export const setup2FA = catchAsync(async (req, res, next) => {
  // The verifyAccessToken middleware ensures req.user is set
  const admin = await Admin.findById(req.user._id).select('+twoFactorSecret');

  // Generate a new TOTP secret
  const secret = speakeasy.generateSecret({ name: `SIHM Admin (${admin.email})` });

  // Save the secret temporarily. Do NOT set is2faEnabled to true until they verify it.
  admin.twoFactorSecret = secret.base32;
  await admin.save({ validateBeforeSave: false });

  // Convert the authenticator URL to a Base64 QR Code image
  const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

  await AuditLog.logEvent({
    adminId: admin._id, action: '2FA_SETUP_INITIATED', status: 'SUCCESS',
    ipAddress: req.ip, userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    status: 'success',
    qrCode: qrCodeDataUrl,
    manualSecret: secret.base32, // Provided just in case their camera is broken
  });
});



// 3. STEP TWO: VERIFY 2FA & CREATE SESSION
export const verify2FA = catchAsync(async (req, res, next) => {
  const { totpCode } = req.body;
  const admin = await Admin.findById(req.user._id).select('+twoFactorSecret');

  if (!admin.twoFactorSecret) {
    return res.status(400).json({ message: '2FA setup has not been initiated.' });
  }

  // Verify the 6-digit code against the server clock
  const isVerified = speakeasy.totp.verify({
    secret: admin.twoFactorSecret,
    encoding: 'base32',
    token: totpCode,
    window: 1, // 30-second grace period
  });

  if (!isVerified) {
    await AuditLog.logEvent({
      adminId: admin._id, action: '2FA_FAILED', status: 'WARNING',
      ipAddress: req.ip, userAgent: req.headers['user-agent']
    });
    return res.status(401).json({ message: 'Invalid or expired 2FA code.' });
  }

  // If this was their first time setting it up, lock it in
  if (!admin.is2faEnabled) {
    admin.is2faEnabled = true;
    await AuditLog.logEvent({
      adminId: admin._id, action: '2FA_SETUP_COMPLETED', status: 'SUCCESS',
      ipAddress: req.ip, userAgent: req.headers['user-agent']
    });
  }

  admin.lastLogin = Date.now();
  await admin.save({ validateBeforeSave: false });

  // --- CREATE THE SESSION ---
  const plainRefreshToken = generateRefreshToken();
  
  const newSession = await Session.create({
    adminId: admin._id,
    refreshToken: plainRefreshToken, // Will be hashed automatically by the pre-save hook
    userAgent: req.headers['user-agent'] || 'unknown',
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Set the HttpOnly Cookie and generate the short-lived JSON token
  setSessionCookie(res, newSession._id, plainRefreshToken);
  const accessToken = generateAccessToken(admin._id);

  await AuditLog.logEvent({
    adminId: admin._id, action: 'LOGIN_SUCCESS', status: 'SUCCESS',
    ipAddress: req.ip, userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    status: 'success',
    accessToken,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    }
  });
});



// 4. REFRESH TOKEN ROTATION (Self-Healing)
export const refreshToken = catchAsync(async (req, res, next) => {
  const cookieHeader = req.cookies.sihm_session;

  if (!cookieHeader || cookieHeader === 'logged_out') {
    return res.status(401).json({ message: 'No valid session found.' });
  }

  // Extract O(1) lookup ID and the plain token string
  const [sessionId, plainToken] = cookieHeader.split('|');

  if (!sessionId || !plainToken) {
    return res.status(401).json({ message: 'Malformed session cookie.' });
  }

  const session = await Session.findById(sessionId);

  // THE TRIPWIRE: If the token is formatted correctly but the session is missing, 
  // it means the session was already consumed or deleted. The token was stolen and reused!
  if (!session) {
    // We cannot reliably know WHICH admin's token was stolen just from the string, 
    // but in a more advanced setup, you could embed the adminId in the plainToken to execute a global wipe here.
    return res.status(401).json({ message: 'Session expired or invalid.' });
  }

  // Check if the session was manually revoked by a Super Admin
  if (!session.isValid) {
    return res.status(403).json({ message: 'This session has been revoked by an administrator.' });
  }

  // Verify the provided token matches the hashed token in the database
  const isTokenValid = await session.compareRefreshToken(plainToken);

  if (!isTokenValid) {
    // STOLEN TOKEN DETECTED: An attacker submitted a valid Session ID but the wrong token.
    // Instant global wipe for this admin to secure the account.
    await Session.deleteMany({ adminId: session.adminId });
    
    await AuditLog.logEvent({
      adminId: session.adminId, action: 'REFRESH_TOKEN_REUSE_DETECTED', status: 'CRITICAL',
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
      details: { reason: 'Mismatched refresh token provided for valid session ID. All sessions wiped.' }
    });

    clearSessionCookie(res);
    return res.status(403).json({ message: 'Security violation detected. All sessions revoked. Please log in again.' });
  }

  // --- TOKEN ROTATION ---
  // The token is valid. Destroy the old session and issue a brand new one.
  await Session.findByIdAndDelete(sessionId);

  const newPlainToken = generateRefreshToken();
  const newSession = await Session.create({
    adminId: session.adminId,
    refreshToken: newPlainToken,
    userAgent: req.headers['user-agent'] || 'unknown',
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
  });

  setSessionCookie(res, newSession._id, newPlainToken);
  const newAccessToken = generateAccessToken(session.adminId);

  res.status(200).json({
    status: 'success',
    accessToken: newAccessToken,
  });
});



// 5. LOGOUT
export const logout = catchAsync(async (req, res, next) => {
  const cookieHeader = req.cookies.sihm_session;

  if (cookieHeader && cookieHeader !== 'logged_out') {
    const [sessionId] = cookieHeader.split('|');
    if (sessionId) {
      const session = await Session.findByIdAndDelete(sessionId);
      if (session) {
        await AuditLog.logEvent({
          adminId: session.adminId, action: 'LOGOUT', status: 'SUCCESS',
          ipAddress: req.ip, userAgent: req.headers['user-agent']
        });
      }
    }
  }

  clearSessionCookie(res);
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});