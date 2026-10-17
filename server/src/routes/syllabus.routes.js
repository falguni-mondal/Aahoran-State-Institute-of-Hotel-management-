import express from 'express';
import {
  getPublicSyllabi,
  getAdminSyllabi,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
} from '../controllers/syllabus.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getPublicSyllabi);

router.use(verifyAccessToken);
router.get('/admin', getAdminSyllabi);
router.post('/', createSyllabus);
router.route('/:id').put(updateSyllabus).delete(deleteSyllabus);

export default router;