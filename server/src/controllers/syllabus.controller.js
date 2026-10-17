import Syllabus from '../models/syllabus.model.js';
import AuditLog from '../models/auditlog.model.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteImageKitFile } from '../utils/imagekit.util.js';

const TAB_LABELS = {
  jnu: 'JNU (New) - Since 2023',
  ignou: 'IGNOU (Old) - Till 2023',
  none: 'Diploma Curriculum',
};

const formatSyllabusRecord = (doc) => ({
  _id: doc._id,
  id: doc._id.toString(),
  recordCode: `SYL-${doc._id.toString().slice(-4).toUpperCase()}`,
  title: doc.title,
  categoryGroup: doc.categoryGroup,
  categoryLabel:
    doc.categoryGroup === 'bsc'
      ? 'B.Sc Degree Programmes'
      : 'Diploma Programmes',
  tabId: doc.tabId || 'none',
  tabLabel: doc.tabLabel || TAB_LABELS[doc.tabId] || 'Diploma Curriculum',
  url: doc.url,
  link: doc.url,
  fileId: doc.fileId || null,
  fileName: doc.fileName || null,
  displayOrder: doc.displayOrder || 0,
  isActive: Boolean(doc.isActive),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// 1. PUBLIC: GET ACTIVE SYLLABI
export const getPublicSyllabi = catchAsync(async (req, res, next) => {
  const items = await Syllabus.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();

  const formatted = items.map(formatSyllabusRecord);

  res.status(200).json({
    status: 'success',
    results: formatted.length,
    syllabi: formatted,
  });
});

// 2. ADMIN: GET ALL SYLLABI
export const getAdminSyllabi = catchAsync(async (req, res, next) => {
  const items = await Syllabus.find()
    .sort({ categoryGroup: 1, displayOrder: 1, createdAt: -1 })
    .lean();

  const formatted = items.map(formatSyllabusRecord);

  res.status(200).json({
    status: 'success',
    results: formatted.length,
    syllabi: formatted,
  });
});

// 3. ADMIN: CREATE SYLLABUS
export const createSyllabus = catchAsync(async (req, res, next) => {
  const {
    title,
    categoryGroup,
    tabId,
    url,
    fileId,
    fileName,
    displayOrder,
    isActive,
  } = req.body;

  if (!title || !categoryGroup || !url) {
    return res.status(400).json({
      status: 'fail',
      message: 'Syllabus title, program category, and PDF URL are required.',
    });
  }

  const resolvedTabId =
    categoryGroup === 'bsc' ? tabId || 'jnu' : 'none';

  const newSyllabus = await Syllabus.create({
    title: title.trim(),
    categoryGroup,
    tabId: resolvedTabId,
    tabLabel: TAB_LABELS[resolvedTabId] || 'Diploma Curriculum',
    url: url.trim(),
    fileId: fileId || null,
    fileName: fileName || null,
    displayOrder: Number(displayOrder) || 0,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'SYLLABUS_CREATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: '/api/v1/syllabus',
      syllabusId: newSyllabus._id,
      title: newSyllabus.title,
      categoryGroup: newSyllabus.categoryGroup,
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Curriculum syllabus published to the archive.',
    syllabus: formatSyllabusRecord(newSyllabus),
  });
});

// 4. ADMIN: UPDATE SYLLABUS
export const updateSyllabus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    categoryGroup,
    tabId,
    url,
    fileId,
    fileName,
    displayOrder,
    isActive,
  } = req.body;

  const existing = await Syllabus.findById(id);
  if (!existing) {
    return res.status(404).json({
      status: 'fail',
      message: 'Syllabus record not found.',
    });
  }

  if (fileId && existing.fileId && fileId !== existing.fileId) {
    await deleteImageKitFile(existing.fileId);
  }

  if (title !== undefined) existing.title = title.trim();
  if (categoryGroup !== undefined) existing.categoryGroup = categoryGroup;
  if (tabId !== undefined || categoryGroup !== undefined) {
    const resolvedTab =
      existing.categoryGroup === 'bsc' ? tabId || existing.tabId || 'jnu' : 'none';
    existing.tabId = resolvedTab;
    existing.tabLabel = TAB_LABELS[resolvedTab] || 'Diploma Curriculum';
  }
  if (url !== undefined) existing.url = url.trim();
  if (fileId !== undefined) existing.fileId = fileId;
  if (fileName !== undefined) existing.fileName = fileName;
  if (displayOrder !== undefined) existing.displayOrder = Number(displayOrder) || 0;
  if (isActive !== undefined) existing.isActive = Boolean(isActive);

  await existing.save();

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'SYLLABUS_UPDATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/syllabus/${id}`,
      syllabusId: existing._id,
      title: existing.title,
      isActive: existing.isActive,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Syllabus record updated.',
    syllabus: formatSyllabusRecord(existing),
  });
});

// 5. ADMIN: DELETE SYLLABUS
export const deleteSyllabus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const target = await Syllabus.findById(id);
  if (!target) {
    return res.status(404).json({
      status: 'fail',
      message: 'Syllabus record not found.',
    });
  }

  if (target.fileId) {
    await deleteImageKitFile(target.fileId);
  }

  await Syllabus.findByIdAndDelete(id);

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'SYLLABUS_DELETED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/syllabus/${id}`,
      deletedSyllabusId: id,
      deletedTitle: target.title,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Syllabus record and associated PDF purged.',
  });
});