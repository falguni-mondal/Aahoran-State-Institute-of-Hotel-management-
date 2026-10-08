import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Admin from '../models/admin.model.js';
import AuditLog from '../models/auditlog.model.js';

// =========================================
// 1. BRUTE-FORCE RATE LIMITING
// =========================================
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, next, options) => {
    await AuditLog.logEvent({
      emailAttempted: req.body.email || 'unknown',
      action: 'LOGIN_FAILED',
      status: 'CRITICAL',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
      details: { reason: 'Rate limit exceeded (Brute-force protection triggered)' },
    });
    res.status(options.statusCode).json(options.message);
  },
});

// =========================================
// 2. PRE-AUTH TOKEN VERIFICATION (Stage 1 Handshake)
// =========================================
// Guards /verify-2fa and /setup-2fa. Accepts ONLY 5-minute pre-auth tokens.
export const verifyPreAuthToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Pre-authentication token required. Please sign in with your credentials first.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Enforce token scope
    if (decoded.type !== 'pre_auth') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token type for 2FA operation.',
      });
    }

    const currentAdmin = await Admin.findById(decoded.id).select(
      '+twoFactorSecret +tempTwoFactorSecret'
    );

    if (!currentAdmin) {
      return res.status(401).json({
        status: 'fail',
        message: 'The administrator account associated with this session no longer exists.',
      });
    }

    if (currentAdmin.isAccountLocked()) {
      return res.status(403).json({
        status: 'fail',
        message: 'Account is temporarily locked due to repeated failed attempts.',
      });
    }

    req.user = currentAdmin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your 2FA session window has expired. Please sign in again.',
      });
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or manipulated pre-authentication token.',
    });
  }
};

// =========================================
// 3. ZERO-TRUST ACCESS TOKEN VERIFICATION (Stage 2 Application Gate)
// =========================================
// Guards all standard protected routes. Accepts ONLY fully authenticated access tokens.
export const verifyAccessToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please provide a valid access token.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Reject intermediate tokens attempting to access application data
    if (decoded.type !== 'access') {
      return res.status(401).json({
        status: 'fail',
        message: 'Clearance incomplete. Two-factor verification must be completed first.',
      });
    }

    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin) {
      return res.status(401).json({
        status: 'fail',
        message: 'The admin belonging to this token no longer exists.',
      });
    }

    if (currentAdmin.isAccountLocked()) {
      return res.status(403).json({
        status: 'fail',
        message: 'Account is temporarily locked due to suspicious activity. Please contact SuperAdmin.',
      });
    }

    if (currentAdmin.passwordChangedAt) {
      const changedTimestamp = parseInt(currentAdmin.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          status: 'fail',
          message: 'Password was recently changed. Please log in again.',
        });
      }
    }

    req.user = currentAdmin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your access token has expired. Please refresh your token.',
        isExpired: true, // Caught by frontend Axios interceptor for silent rotation
      });
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid access token. Authentication failed.',
    });
  }
};

// =========================================
// 4. ROLE-BASED ACCESS CONTROL (RBAC)
// =========================================
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};