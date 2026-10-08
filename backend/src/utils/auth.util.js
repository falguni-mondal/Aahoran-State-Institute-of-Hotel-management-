import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 1. Generate an ephemeral 5-minute Pre-Auth Token specifically scoped for 2FA validation
export const generatePreAuthToken = (adminId) => {
  return jwt.sign(
    { id: adminId, type: 'pre_auth' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '5m' }
  );
};

// 2. Generate a 15-minute Access Token containing verified identity and role claims
export const generateAccessToken = (adminId, role = 'Admin') => {
  return jwt.sign(
    { id: adminId, role, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

// 3. Generate a cryptographically secure random string for the Refresh Token
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// 4. Standardized HttpOnly Cookie Configuration
const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks (JavaScript cannot read document.cookie)
  secure: process.env.NODE_ENV === 'production', // Enforces HTTPS in production
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // 'lax' prevents cross-port cookie dropping on localhost
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
};

// 5. Set the session cookie. Stores "sessionId|plainToken" for O(1) database lookups
export const setSessionCookie = (res, sessionId, plainToken) => {
  const cookieValue = `${sessionId}|${plainToken}`;
  res.cookie('sihm_session', cookieValue, cookieOptions);
};

// 6. Instantly invalidate and purge the session cookie
export const clearSessionCookie = (res) => {
  res.cookie('sihm_session', 'logged_out', {
    ...cookieOptions,
    maxAge: 0,
    expires: new Date(0),
  });
};