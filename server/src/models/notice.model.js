import mongoose from 'mongoose';

const VALID_CATEGORIES = [
  'student',
  'exam',
  'office',
  'placement',
  'tender',
  'recruitment',
];

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [300, 'Notice title cannot exceed 300 characters'],
    },
    categoryId: {
      type: String,
      required: [true, 'Notice category is required'],
      enum: {
        values: VALID_CATEGORIES,
        message: 'Invalid notice category selected',
      },
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Publish date is required'],
    },
    isNewUpdate: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      required: [true, 'Notice document URL is required'],
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

// Compound index for fast public filtering and chronological sorting
noticeSchema.index({ isActive: 1, categoryId: 1, publishDate: -1, createdAt: -1 });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;