import mongoose from 'mongoose';

const syllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Syllabus document title is required'],
      trim: true,
      maxlength: [300, 'Syllabus title cannot exceed 300 characters'],
    },
    categoryGroup: {
      type: String,
      required: [true, 'Category group is required'],
      enum: ['bsc', 'diploma'],
      index: true,
    },
    tabId: {
      type: String,
      enum: ['jnu', 'ignou', 'none'],
      default: 'jnu',
      index: true,
    },
    tabLabel: {
      type: String,
      default: 'JNU (New) - Since 2023',
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Syllabus PDF URL is required'],
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
    displayOrder: {
      type: Number,
      default: 0,
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

syllabusSchema.index({ isActive: 1, categoryGroup: 1, tabId: 1, displayOrder: 1, createdAt: 1 });

const Syllabus = mongoose.model('Syllabus', syllabusSchema);

export default Syllabus;