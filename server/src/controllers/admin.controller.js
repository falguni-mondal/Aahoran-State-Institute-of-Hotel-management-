import Admin from '../models/admin.model.js';
import Session from '../models/session.model.js';
import AuditLog from '../models/auditlog.model.js';
import catchAsync from '../utils/catchAsync.js';

// =========================================
// 1. GET ALL ADMINISTRATORS (SuperAdmin Only)
// =========================================
export const getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find()
    .select('-password -twoFactorSecret -tempTwoFactorSecret -backupCodes')
    .sort({ createdAt: -1 });

  // Map to the exact schema contract expected by AdminRosterTable.jsx
  const formattedAdmins = admins.map((admin, index) => {
    let computedStatus = 'ACTIVE';
    if (admin.isAccountLocked()) {
      computedStatus = 'LOCKED';
    } else if (!admin.is2faEnabled) {
      computedStatus = 'PENDING_2FA';
    }

    return {
      _id: admin._id,
      id: `ADM-${String(index + 1).padStart(3, '0')}`,
      email: admin.email,
      role: admin.role,
      is2faEnabled: admin.is2faEnabled,
      status: computedStatus,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin
        ? new Date(admin.lastLogin).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Never',
    };
  });

  res.status(200).json({
    status: 'success',
    results: formattedAdmins.length,
    admins: formattedAdmins,
  });
});

// =========================================
// 2. CREATE NEW ADMINISTRATOR (SuperAdmin Only)
// =========================================
export const createAdmin = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Official personnel email and temporary passphrase are required.',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: 'fail',
      message: 'Temporary passphrase must be at least 8 characters long.',
    });
  }

  const assignedRole = role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({
      status: 'fail',
      message: 'An administrative account with this email address already exists.',
    });
  }

  const newAdmin = await Admin.create({
    email,
    password,
    role: assignedRole,
  });

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'ADMIN_PROVISIONED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: { provisionedEmail: email, provisionedRole: assignedRole },
  });

  res.status(201).json({
    status: 'success',
    message: `${assignedRole} profile enrolled. Mandatory 2FA verification will be required on initial login.`,
    admin: {
      _id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
      is2faEnabled: false,
      status: 'PENDING_2FA',
      createdAt: newAdmin.createdAt,
      lastLogin: 'Never',
    },
  });
});

// =========================================
// 3. REVOKE ADMINISTRATOR PRIVILEGES (SuperAdmin Only)
// =========================================
export const revokeAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (req.user._id.toString() === id) {
    return res.status(400).json({
      status: 'fail',
      message: 'Action rejected: You cannot revoke your own active administrative session.',
    });
  }

  const targetAdmin = await Admin.findById(id);
  if (!targetAdmin) {
    return res.status(404).json({
      status: 'fail',
      message: 'Administrator record not found.',
    });
  }

  // Purge all active sessions belonging to the target administrator
  await Session.deleteMany({ adminId: targetAdmin._id });

  // Delete administrator record
  await Admin.findByIdAndDelete(id);

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'SESSION_REVOKED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      revokedEmail: targetAdmin.email,
      revokedRole: targetAdmin.role,
      reason: 'SUPERADMIN_REVOCATION_DIRECTIVE',
    },
  });

  res.status(200).json({
    status: 'success',
    message: `Administrative credentials for ${targetAdmin.email} have been revoked and all sessions terminated.`,
  });
});