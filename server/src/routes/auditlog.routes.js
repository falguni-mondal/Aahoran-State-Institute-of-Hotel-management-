import express from 'express';
import {
  getAuditLogs,
  getDashboardTelemetry,
} from '../controllers/auditlog.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Enforce verified clearance on audit routes
router.use(verifyAccessToken);

router.get('/', getAuditLogs);
router.get('/telemetry', getDashboardTelemetry);

export default router;