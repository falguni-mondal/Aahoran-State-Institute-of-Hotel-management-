import express from 'express';
import {
  login,
  setup2FA,
  verify2FA,
  resetMy2FA,
  refreshToken,
  logout,
} from '../controllers/auth.controller.js';
import {
  loginLimiter,
  verifyPreAuthToken,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', loginLimiter, login);
router.get('/refresh', refreshToken);
router.post('/logout', logout);

router.post('/verify-2fa', loginLimiter, verifyPreAuthToken, verify2FA);
router.post('/setup-2fa', verifyPreAuthToken, setup2FA);
router.post('/reset-2fa', verifyPreAuthToken, resetMy2FA);

export default router;