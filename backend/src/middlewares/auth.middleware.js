import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Admin from '../models/admin.model.js';
import AuditLog from '../models/auditlog.model.js';



// BRUTE-FORCE PROTECTION (Rate Limiting)
// This will be applied ONLY to the /login and /verify-2fa routes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: {
    status: 'fail',
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: async (req, res, next, options) => {
    // Log the brute-force attempt for government compliance
    await AuditLog.logEvent({
      emailAttempted: req.body.email || 'unknown',
      action: 'LOGIN_FAILED',
      status: 'CRITICAL',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
      details: { reason: 'Rate limit exceeded (Brute-force protection triggered)' }
    });
    res.status(options.statusCode).json(options.message);
  }
});



// TOKEN VERIFICATION (The Zero-Trust Gate)
export const verifyAccessToken = async (req, res, next) => {
  try {
    let token;
    
    // 1. Check if the Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please provide a valid access token.',
      });
    }

    // 2. Verify the token signature (Catches expired or manipulated tokens)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Check if the admin still exists in the database
    // (Prevents a deleted admin from continuing to use a valid token)
    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin) {
      return res.status(401).json({
        status: 'fail',
        message: 'The admin belonging to this token no longer exists.',
      });
    }

    // 4. Check if the account has been temporarily locked
    if (currentAdmin.isAccountLocked()) {
      return res.status(403).json({
        status: 'fail',
        message: 'Account is temporarily locked due to suspicious activity. Please contact SuperAdmin.',
      });
    }

    // 5. Check if the admin changed their password AFTER the token was issued
    // (If an account is compromised and the real admin resets the password, this instantly invalidates the hacker's token)
    if (currentAdmin.passwordChangedAt) {
      const changedTimestamp = parseInt(currentAdmin.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          status: 'fail',
          message: 'Password was recently changed. Please log in again.',
        });
      }
    }

    // 6. Grant Access: Attach the verified admin document to the request object
    req.user = currentAdmin;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your access token has expired. Please refresh your token.',
        isExpired: true // The frontend can read this flag to silently trigger the /refresh route
      });
    }
    
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid access token. Authentication failed.',
    });
  }
};



// 3. ROLE-BASED ACCESS CONTROL (RBAC)
// Pass an array of allowed roles, e.g., restrictTo('SuperAdmin')
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is guaranteed to exist here because verifyAccessToken runs first
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};