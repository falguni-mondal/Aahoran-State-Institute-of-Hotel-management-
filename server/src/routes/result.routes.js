import express from 'express';
import {
  getPublicResults,
  getAdminResults,
  createResult,
  updateResult,
  deleteResult,
} from '../controllers/result.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getPublicResults);

router.use(verifyAccessToken);
router.get('/admin', getAdminResults);
router.post('/', createResult);
router.route('/:id').put(updateResult).delete(deleteResult);

export default router;