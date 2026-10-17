import express from 'express';
import {
  getPublicStudyMaterials,
  getAdminStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
} from '../controllers/studyMaterial.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getPublicStudyMaterials);

router.use(verifyAccessToken);
router.get('/admin', getAdminStudyMaterials);
router.post('/', createStudyMaterial);
router.route('/:id').put(updateStudyMaterial).delete(deleteStudyMaterial);

export default router;