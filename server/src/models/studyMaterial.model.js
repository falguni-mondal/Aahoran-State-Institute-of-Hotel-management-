import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Material document title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    programType: {
      type: String,
      required: [true, 'Program type is required'],
      enum: ['bsc', 'diploma'],
      index: true,
    },
    semesterId: {
      type: String,
      enum: ['none', 'sem-1', 'sem-2', 'sem-3', 'sem-4', 'sem-5', 'sem-6'],
      default: 'none',
      index: true,
    },
    semesterLabel: {
      type: String,
      default: '',
      trim: true,
    },
    subjectId: {
      type: String,
      required: [true, 'Subject identifier is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    subjectTitle: {
      type: String,
      required: [true, 'Subject display title is required'],
      trim: true,
    },
    topicTitle: {
      type: String,
      default: '',
      trim: true,
    },
    isNewUpdate: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: [true, 'Study material document URL is required'],
      trim: true,
    },
    fileId: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

studyMaterialSchema.index({
  isActive: 1,
  programType: 1,
  semesterId: 1,
  subjectId: 1,
  createdAt: 1,
});

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

export default StudyMaterial;