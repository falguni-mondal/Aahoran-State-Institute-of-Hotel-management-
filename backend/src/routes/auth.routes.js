import express from 'express';
import {
  login,
  setup2FA,
  verify2FA,
  refreshToken,
  logout
} from '../controllers/auth.controller.js';
import {
  loginLimiter,
  verifyAccessToken
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// =========================================
// 1. PUBLIC ROUTES
// =========================================

// Rate-limited to prevent brute-force password guessing
router.post('/login', loginLimiter, login);

// Relies entirely on the HttpOnly cookie, so no Bearer token is needed
router.get('/refresh', refreshToken);

// Safely destroys the session and clears the browser cookie
router.post('/logout', logout);

// =========================================
// 2. PROTECTED ROUTES
// =========================================

// Requires the 5-minute Pre-Auth Token (issued by /login) in the Authorization header.
// We apply loginLimiter here to prevent brute-forcing the 6-digit TOTP code.
router.post('/verify-2fa', loginLimiter, verifyAccessToken, verify2FA);

// Requires a standard 15-minute Access Token (issued by /verify-2fa).
// Used when an admin logs in for the very first time to generate their QR code.
router.post('/setup-2fa', verifyAccessToken, setup2FA);

export default router;