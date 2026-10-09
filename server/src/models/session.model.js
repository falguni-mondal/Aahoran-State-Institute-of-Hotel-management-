import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sessionSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Session must belong to an admin'],
      index: true, // Speeds up queries when revoking all sessions for a specific user
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
    },
    userAgent: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL (Time-To-Live) index. 
      // The database will automatically delete this document when the current time reaches this Date.
      expires: 0, 
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// MONGOOSE MIDDLEWARE (Hooks)
// =========================================

// Promise-based hook: no 'next' parameter needed when using 'async'
sessionSchema.pre('save', async function () {
  // Only hash if the token is new or has been updated (Refresh Token Rotation)
  if (!this.isModified('refreshToken')) return;

  // A cost factor of 10 is fast enough for frequent rotations but secure enough for tokens
  this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
});

// =========================================
// INSTANCE METHODS
// =========================================

// Method to verify the plain-text cookie token against the hashed database token
sessionSchema.methods.compareRefreshToken = async function (candidateToken) {
  return await bcrypt.compare(candidateToken, this.refreshToken);
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;