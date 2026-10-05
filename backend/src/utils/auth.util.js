import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 1. Generate a 5-minute Pre-Auth Token for the 2FA step
export const generatePreAuthToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' });
};

// 2. Generate a 15-minute Access Token for authorized requests
export const generateAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

// 3. Generate a cryptographically secure random string for the Refresh Token
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// 4. Standardized HttpOnly Cookie Configuration
const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks (JS cannot read it)
  secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
  sameSite: 'strict', // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// 5. Set the session cookie. We store BOTH the Session ID and the plain token
// Format: "sessionId|plainToken". This allows O(1) database lookups later.
export const setSessionCookie = (res, sessionId, plainToken) => {
  const cookieValue = `${sessionId}|${plainToken}`;
  res.cookie('sihm_session', cookieValue, cookieOptions);
};

// 6. Clear the session cookie on logout
export const clearSessionCookie = (res) => {
  res.cookie('sihm_session', 'logged_out', {
    ...cookieOptions,
    maxAge: 10 * 1000, // Expires in 10 seconds
  });
};