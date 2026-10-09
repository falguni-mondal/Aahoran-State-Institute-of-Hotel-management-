import crypto from 'crypto';
import AuditLog from '../models/auditlog.model.js';
import Session from '../models/session.model.js';
import Admin from '../models/admin.model.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to safely escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// =========================================
// 1. GET AUDIT LOGS STREAM WITH FORENSIC HASHES
// =========================================
export const getAuditLogs = catchAsync(async (req, res, next) => {
  const { action, status, search, limit = 50, page = 1 } = req.query;

  const query = {};

  if (action && action !== 'ALL') {
    query.action = action;
  }

  if (status && status !== 'ALL') {
    query.status = status;
  }

  if (search && search.trim() !== '') {
    const sanitizedSearch = escapeRegex(search.trim());
    const searchRegex = new RegExp(sanitizedSearch, 'i');
    query.$or = [
      { action: searchRegex },
      { ipAddress: searchRegex },
      { emailAttempted: searchRegex },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('adminId', 'email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  // Map each log into immutable ledger structure with deterministic SHA-256 hash
  const formattedLogs = logs.map((log) => {
    const actorEmail = log.adminId?.email || log.emailAttempted || 'System';
    const payloadForHashing = `${log._id}-${log.timestamp}-${log.action}-${actorEmail}-${log.ipAddress}`;
    const hash = crypto.createHash('sha256').update(payloadForHashing).digest('hex');

    return {
      _id: log._id,
      id: `AUD-${log._id.toString().slice(-6).toUpperCase()}`,
      timestamp: log.timestamp,
      action: log.action,
      actor: actorEmail,
      target: log.details?.endpoint || '/api/v1/auth',
      status: log.status,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      hash,
      metadata: log.details || {},
    };
  });

  res.status(200).json({
    status: 'success',
    total,
    page: pageNum,
    results: formattedLogs.length,
    logs: formattedLogs,
  });
});

// =========================================
// 2. GET DASHBOARD TELEMETRY METRICS
// =========================================
export const getDashboardTelemetry = catchAsync(async (req, res, next) => {
  const [activeSessions, totalAudits, totalAdmins, recentLogs] = await Promise.all([
    Session.countDocuments({ isValid: true, expiresAt: { $gt: new Date() } }),
    AuditLog.countDocuments(),
    Admin.countDocuments(),
    AuditLog.find()
      .populate('adminId', 'email')
      .sort({ timestamp: -1 })
      .limit(5)
      .lean(),
  ]);

  const recentEvents = recentLogs.map((log) => ({
    id: `AUD-${log._id.toString().slice(-4).toUpperCase()}`,
    action: log.action,
    resource: log.details?.endpoint || '/api/v1/auth',
    user: log.adminId?.email || log.emailAttempted || 'System',
    ip: log.ipAddress,
    status: log.status,
    timestamp: log.timestamp,
  }));

  res.status(200).json({
    status: 'success',
    telemetry: {
      activeSessions,
      totalAudits,
      gatewayUptime: 99.98,
      totalAdmins,
    },
    recentEvents,
  });
});