import Notice from '../models/notice.model.js';
import AuditLog from '../models/auditlog.model.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteImageKitFile } from '../utils/imagekit.util.js';

// Helper: Format Date into DD/MM/YYYY for the public Notice Board UI
const formatDisplayDate = (dateValue) => {
  const d = new Date(dateValue || Date.now());
  if (isNaN(d.getTime())) return 'N/A';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper: Transform Mongoose document into the frontend contract
const formatNoticeRecord = (notice) => ({
  _id: notice._id,
  id: notice._id.toString(),
  recordCode: `NTC-${notice._id.toString().slice(-4).toUpperCase()}`,
  title: notice.title,
  categoryId: notice.categoryId,
  publishDate: notice.publishDate,
  date: formatDisplayDate(notice.publishDate),
  isNew: Boolean(notice.isNewUpdate),
  url: notice.url,
  fileId: notice.fileId || null,
  fileName: notice.fileName || null,
  isActive: Boolean(notice.isActive),
  createdAt: notice.createdAt,
  updatedAt: notice.updatedAt,
});



// =========================================
// PUBLIC: GET ACTIVE NOTICES
// =========================================
export const getPublicNotices = catchAsync(async (req, res, next) => {
  const { category } = req.query;

  const filter = { isActive: true };
  if (category && category !== 'all') {
    filter.categoryId = category;
  }

  const notices = await Notice.find(filter)
    .sort({ publishDate: -1, createdAt: -1 })
    .lean();

  const formattedNotices = notices.map(formatNoticeRecord);

  res.status(200).json({
    status: 'success',
    results: formattedNotices.length,
    notices: formattedNotices,
  });
});



// =========================================
// ADMIN: GET ALL NOTICES (INCLUDING DRAFTS)
// =========================================
export const getAdminNotices = catchAsync(async (req, res, next) => {
  const notices = await Notice.find()
    .sort({ publishDate: -1, createdAt: -1 })
    .lean();

  const formattedNotices = notices.map(formatNoticeRecord);

  res.status(200).json({
    status: 'success',
    results: formattedNotices.length,
    notices: formattedNotices,
  });
});



// =========================================
// ADMIN: CREATE NEW NOTICE
// =========================================
export const createNotice = catchAsync(async (req, res, next) => {
  const {
    title,
    categoryId,
    publishDate,
    isNew,
    url,
    fileId,
    fileName,
    isActive,
  } = req.body;

  if (!title || !categoryId || !url) {
    return res.status(400).json({
      status: 'fail',
      message: 'Notice title, category, and document URL are required.',
    });
  }

  const newNotice = await Notice.create({
    title: title.trim(),
    categoryId,
    publishDate: publishDate ? new Date(publishDate) : Date.now(),
    isNewUpdate: isNew !== undefined ? Boolean(isNew) : true,
    url: url.trim(),
    fileId: fileId || null,
    fileName: fileName || null,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'NOTICE_CREATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: '/api/v1/notices',
      noticeId: newNotice._id,
      title: newNotice.title,
      categoryId: newNotice.categoryId,
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Official notice published to the institutional registry.',
    notice: formatNoticeRecord(newNotice),
  });
});



// =========================================
// ADMIN: UPDATE NOTICE
// =========================================
export const updateNotice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    categoryId,
    publishDate,
    isNew,
    url,
    fileId,
    fileName,
    isActive,
  } = req.body;

  const existingNotice = await Notice.findById(id);
  if (!existingNotice) {
    return res.status(404).json({
      status: 'fail',
      message: 'Notice record not found.',
    });
  }

  // If a new PDF was uploaded to ImageKit, purge the old PDF asset
  if (
    fileId &&
    existingNotice.fileId &&
    fileId !== existingNotice.fileId
  ) {
    await deleteImageKitFile(existingNotice.fileId);
  }

  if (title !== undefined) existingNotice.title = title.trim();
  if (categoryId !== undefined) existingNotice.categoryId = categoryId;
  if (publishDate !== undefined) existingNotice.publishDate = new Date(publishDate);
  if (isNew !== undefined) existingNotice.isNewUpdate = Boolean(isNew);
  if (url !== undefined) existingNotice.url = url.trim();
  if (fileId !== undefined) existingNotice.fileId = fileId;
  if (fileName !== undefined) existingNotice.fileName = fileName;
  if (isActive !== undefined) existingNotice.isActive = Boolean(isActive);

  await existingNotice.save();

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'NOTICE_UPDATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/notices/${id}`,
      noticeId: existingNotice._id,
      title: existingNotice.title,
      categoryId: existingNotice.categoryId,
      isActive: existingNotice.isActive,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Notice record updated.',
    notice: formatNoticeRecord(existingNotice),
  });
});



// =========================================
// ADMIN: DELETE NOTICE
// =========================================
export const deleteNotice = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const targetNotice = await Notice.findById(id);
  if (!targetNotice) {
    return res.status(404).json({
      status: 'fail',
      message: 'Notice record not found.',
    });
  }

  // Purge the associated PDF document from ImageKit CDN if one exists
  if (targetNotice.fileId) {
    await deleteImageKitFile(targetNotice.fileId);
  }

  await Notice.findByIdAndDelete(id);

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'NOTICE_DELETED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/notices/${id}`,
      deletedNoticeId: id,
      deletedTitle: targetNotice.title,
      categoryId: targetNotice.categoryId,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Notice record and associated document purged.',
  });
});