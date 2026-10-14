import express from 'express';
import {
  getPublicNotices,
  getAdminNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/notice.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// =========================================
// PUBLIC ROUTE (Consumed by Client Portal)
// =========================================
router.get('/', getPublicNotices);

// =========================================
// PROTECTED ROUTES (Admin & SuperAdmin Clearance)
// =========================================
router.use(verifyAccessToken);

router.get('/admin', getAdminNotices);
router.post('/', createNotice);

router
  .route('/:id')
  .put(updateNotice)
  .delete(deleteNotice);

export default router;