import Result from '../models/result.model.js';
import AuditLog from '../models/auditlog.model.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteImageKitFile } from '../utils/imagekit.util.js';

const formatResultRecord = (doc) => ({
  _id: doc._id,
  id: doc._id.toString(),
  recordCode: `RES-${doc._id.toString().slice(-4).toUpperCase()}`,
  title: doc.title,
  programType: doc.programType,
  sessionId: doc.sessionId,
  sessionLabel: doc.sessionLabel,
  semesterId: doc.semesterId || 'none',
  type: doc.examType || 'Regular',
  examType: doc.examType || 'Regular',
  isNew: Boolean(doc.isNewUpdate),
  url: doc.url,
  fileId: doc.fileId || null,
  fileName: doc.fileName || null,
  verificationLink: doc.verificationLabel || '',
  verificationLabel: doc.verificationLabel || '',
  verificationUrl: doc.verificationUrl || '',
  isActive: Boolean(doc.isActive),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// 1. PUBLIC: GET ACTIVE RESULTS
export const getPublicResults = catchAsync(async (req, res, next) => {
  const results = await Result.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  const formatted = results.map(formatResultRecord);

  res.status(200).json({
    status: 'success',
    results: formatted.length,
    data: formatted,
  });
});

// 2. ADMIN: GET ALL RESULTS
export const getAdminResults = catchAsync(async (req, res, next) => {
  const results = await Result.find().sort({ createdAt: -1 }).lean();
  const formatted = results.map(formatResultRecord);

  res.status(200).json({
    status: 'success',
    results: formatted.length,
    data: formatted,
  });
});

// 3. ADMIN: CREATE RESULT
export const createResult = catchAsync(async (req, res, next) => {
  const {
    title,
    programType,
    sessionId,
    sessionLabel,
    semesterId,
    examType,
    isNew,
    url,
    fileId,
    fileName,
    verificationLabel,
    verificationUrl,
    isActive,
  } = req.body;

  if (!title || !programType || !sessionId || !sessionLabel || !url) {
    return res.status(400).json({
      status: 'fail',
      message: 'Title, program type, session details, and document URL are required.',
    });
  }

  const newResult = await Result.create({
    title: title.trim(),
    programType,
    sessionId: sessionId.trim(),
    sessionLabel: sessionLabel.trim(),
    semesterId: programType === 'bsc' ? semesterId || '1' : 'none',
    examType: examType || 'Regular',
    isNewUpdate: isNew !== undefined ? Boolean(isNew) : true,
    url: url.trim(),
    fileId: fileId || null,
    fileName: fileName || null,
    verificationLabel: verificationLabel ? verificationLabel.trim() : '',
    verificationUrl: verificationUrl ? verificationUrl.trim() : '',
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'RESULT_CREATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: '/api/v1/results',
      resultId: newResult._id,
      title: newResult.title,
      programType: newResult.programType,
      sessionId: newResult.sessionId,
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Academic result published to the institutional archive.',
    result: formatResultRecord(newResult),
  });
});

// 4. ADMIN: UPDATE RESULT
export const updateResult = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    programType,
    sessionId,
    sessionLabel,
    semesterId,
    examType,
    isNew,
    url,
    fileId,
    fileName,
    verificationLabel,
    verificationUrl,
    isActive,
  } = req.body;

  const existing = await Result.findById(id);
  if (!existing) {
    return res.status(404).json({
      status: 'fail',
      message: 'Result record not found.',
    });
  }

  if (fileId && existing.fileId && fileId !== existing.fileId) {
    await deleteImageKitFile(existing.fileId);
  }

  if (title !== undefined) existing.title = title.trim();
  if (programType !== undefined) existing.programType = programType;
  if (sessionId !== undefined) existing.sessionId = sessionId.trim();
  if (sessionLabel !== undefined) existing.sessionLabel = sessionLabel.trim();
  if (semesterId !== undefined) {
    existing.semesterId = existing.programType === 'bsc' ? semesterId : 'none';
  }
  if (examType !== undefined) existing.examType = examType;
  if (isNew !== undefined) existing.isNewUpdate = Boolean(isNew);
  if (url !== undefined) existing.url = url.trim();
  if (fileId !== undefined) existing.fileId = fileId;
  if (fileName !== undefined) existing.fileName = fileName;
  if (verificationLabel !== undefined) {
    existing.verificationLabel = verificationLabel.trim();
  }
  if (verificationUrl !== undefined) {
    existing.verificationUrl = verificationUrl.trim();
  }
  if (isActive !== undefined) existing.isActive = Boolean(isActive);

  await existing.save();

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'RESULT_UPDATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/results/${id}`,
      resultId: existing._id,
      title: existing.title,
      isActive: existing.isActive,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Result record updated.',
    result: formatResultRecord(existing),
  });
});

// 5. ADMIN: DELETE RESULT
export const deleteResult = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const target = await Result.findById(id);
  if (!target) {
    return res.status(404).json({
      status: 'fail',
      message: 'Result record not found.',
    });
  }

  if (target.fileId) {
    await deleteImageKitFile(target.fileId);
  }

  await Result.findByIdAndDelete(id);

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'RESULT_DELETED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/results/${id}`,
      deletedResultId: id,
      deletedTitle: target.title,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Result record and associated PDF purged.',
  });
});