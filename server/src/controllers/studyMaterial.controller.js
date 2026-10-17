import StudyMaterial from '../models/studyMaterial.model.js';
import AuditLog from '../models/auditlog.model.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteImageKitFile } from '../utils/imagekit.util.js';

const SEMESTER_LABELS = {
  'sem-1': 'Semester I',
  'sem-2': 'Semester II',
  'sem-3': 'Semester III',
  'sem-4': 'Semester IV',
  'sem-5': 'Semester V',
  'sem-6': 'Semester VI',
  none: 'Diploma Module',
};

const slugifySubject = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general';

const formatMaterialRecord = (doc) => ({
  _id: doc._id,
  id: doc._id.toString(),
  recordCode: `MAT-${doc._id.toString().slice(-4).toUpperCase()}`,
  title: doc.title,
  programType: doc.programType,
  semesterId: doc.semesterId || 'none',
  semesterLabel:
    doc.semesterLabel || SEMESTER_LABELS[doc.semesterId] || 'Diploma Module',
  subjectId: doc.subjectId,
  subjectTitle: doc.subjectTitle,
  topicTitle: doc.topicTitle || '',
  isNew: Boolean(doc.isNewUpdate),
  url: doc.url,
  link: doc.url,
  fileId: doc.fileId || null,
  fileName: doc.fileName || null,
  isActive: Boolean(doc.isActive),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// 1. PUBLIC: GET ACTIVE STUDY MATERIALS
export const getPublicStudyMaterials = catchAsync(async (req, res, next) => {
  const materials = await StudyMaterial.find({ isActive: true })
    .sort({ createdAt: 1 })
    .lean();

  const formatted = materials.map(formatMaterialRecord);

  res.status(200).json({
    status: 'success',
    results: formatted.length,
    materials: formatted,
  });
});

// 2. ADMIN: GET ALL STUDY MATERIALS
export const getAdminStudyMaterials = catchAsync(async (req, res, next) => {
  const materials = await StudyMaterial.find().sort({ createdAt: -1 }).lean();
  const formatted = materials.map(formatMaterialRecord);

  res.status(200).json({
    status: 'success',
    results: formatted.length,
    materials: formatted,
  });
});

// 3. ADMIN: CREATE STUDY MATERIAL
export const createStudyMaterial = catchAsync(async (req, res, next) => {
  const {
    title,
    programType,
    semesterId,
    subjectId,
    subjectTitle,
    topicTitle,
    isNew,
    url,
    fileId,
    fileName,
    isActive,
  } = req.body;

  if (!title || !programType || !subjectTitle || !url) {
    return res.status(400).json({
      status: 'fail',
      message: 'Title, program type, subject title, and document URL are required.',
    });
  }

  const resolvedSemesterId =
    programType === 'bsc' ? semesterId || 'sem-1' : 'none';
  const resolvedSubjectId =
    subjectId?.trim() || slugifySubject(subjectTitle);

  const newMaterial = await StudyMaterial.create({
    title: title.trim(),
    programType,
    semesterId: resolvedSemesterId,
    semesterLabel: SEMESTER_LABELS[resolvedSemesterId] || 'Diploma Module',
    subjectId: resolvedSubjectId,
    subjectTitle: subjectTitle.trim(),
    topicTitle: programType === 'diploma' ? (topicTitle || 'General Module').trim() : '',
    isNewUpdate: isNew !== undefined ? Boolean(isNew) : false,
    url: url.trim(),
    fileId: fileId || null,
    fileName: fileName || null,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'MATERIAL_CREATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: '/api/v1/study-materials',
      materialId: newMaterial._id,
      title: newMaterial.title,
      programType: newMaterial.programType,
      subjectTitle: newMaterial.subjectTitle,
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Study material added to the academic archive.',
    material: formatMaterialRecord(newMaterial),
  });
});

// 4. ADMIN: UPDATE STUDY MATERIAL
export const updateStudyMaterial = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    programType,
    semesterId,
    subjectId,
    subjectTitle,
    topicTitle,
    isNew,
    url,
    fileId,
    fileName,
    isActive,
  } = req.body;

  const existing = await StudyMaterial.findById(id);
  if (!existing) {
    return res.status(404).json({
      status: 'fail',
      message: 'Study material record not found.',
    });
  }

  if (fileId && existing.fileId && fileId !== existing.fileId) {
    await deleteImageKitFile(existing.fileId);
  }

  if (title !== undefined) existing.title = title.trim();
  if (programType !== undefined) existing.programType = programType;
  if (semesterId !== undefined) {
    existing.semesterId =
      existing.programType === 'bsc' ? semesterId : 'none';
    existing.semesterLabel =
      SEMESTER_LABELS[existing.semesterId] || 'Diploma Module';
  }
  if (subjectTitle !== undefined) {
    existing.subjectTitle = subjectTitle.trim();
    existing.subjectId =
      subjectId?.trim() || slugifySubject(subjectTitle);
  }
  if (topicTitle !== undefined) {
    existing.topicTitle =
      existing.programType === 'diploma' ? topicTitle.trim() : '';
  }
  if (isNew !== undefined) existing.isNewUpdate = Boolean(isNew);
  if (url !== undefined) existing.url = url.trim();
  if (fileId !== undefined) existing.fileId = fileId;
  if (fileName !== undefined) existing.fileName = fileName;
  if (isActive !== undefined) existing.isActive = Boolean(isActive);

  await existing.save();

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'MATERIAL_UPDATED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/study-materials/${id}`,
      materialId: existing._id,
      title: existing.title,
      isActive: existing.isActive,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Study material record updated.',
    material: formatMaterialRecord(existing),
  });
});

// 5. ADMIN: DELETE STUDY MATERIAL
export const deleteStudyMaterial = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const target = await StudyMaterial.findById(id);
  if (!target) {
    return res.status(404).json({
      status: 'fail',
      message: 'Study material record not found.',
    });
  }

  if (target.fileId) {
    await deleteImageKitFile(target.fileId);
  }

  await StudyMaterial.findByIdAndDelete(id);

  await AuditLog.logEvent({
    adminId: req.user._id,
    action: 'MATERIAL_DELETED',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    details: {
      endpoint: `/api/v1/study-materials/${id}`,
      deletedMaterialId: id,
      deletedTitle: target.title,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Study material and associated document purged.',
  });
});