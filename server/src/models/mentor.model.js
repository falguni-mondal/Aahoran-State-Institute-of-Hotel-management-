import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mentor name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Designation or role is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Mentor portrait image URL is required'],
      default: '/nchmct-bg.webp',
      trim: true,
    },
    imageFileId: {
      type: String,
      default: null,
      trim: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
      index: true,
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

// Optimize sequential retrieval for client rendering
mentorSchema.index({ isActive: 1, order: 1, createdAt: 1 });

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;