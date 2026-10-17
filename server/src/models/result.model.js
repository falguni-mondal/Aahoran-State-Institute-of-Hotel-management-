import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Result title is required'],
      trim: true,
      maxlength: [300, 'Result title cannot exceed 300 characters'],
    },
    programType: {
      type: String,
      required: [true, 'Program type is required'],
      enum: {
        values: ['bsc', 'diploma'],
        message: 'Program type must be either bsc or diploma',
      },
      index: true,
    },
    sessionId: {
      type: String,
      required: [true, 'Academic session ID is required (e.g., 23-24)'],
      trim: true,
      index: true,
    },
    sessionLabel: {
      type: String,
      required: [true, 'Session display label is required (e.g., 2023 - 24)'],
      trim: true,
    },
    semesterId: {
      type: String,
      enum: ['none', '1', '2', '3', '4', '5', '6'],
      default: 'none',
      index: true,
    },
    examType: {
      type: String,
      enum: ['Regular', 'Reappear'],
      default: 'Regular',
    },
    isNewUpdate: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      required: [true, 'Result PDF URL is required'],
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
    verificationLabel: {
      type: String,
      default: '',
      trim: true,
    },
    verificationUrl: {
      type: String,
      default: '',
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

resultSchema.index({ isActive: 1, programType: 1, sessionId: -1, createdAt: -1 });

const Result = mongoose.model('Result', resultSchema);

export default Result;