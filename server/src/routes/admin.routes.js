import express from 'express';
import {
  getAllAdmins,
  createAdmin,
  revokeAdmin,
} from '../controllers/admin.controller.js';
import {
  verifyAccessToken,
  restrictTo,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// All administrative management routes require a valid Access Token and SuperAdmin clearance
router.use(verifyAccessToken, restrictTo('SuperAdmin'));

router.route('/')
  .get(getAllAdmins)
  .post(createAdmin);

router.route('/:id')
  .delete(revokeAdmin);

export default router;