import mongoose from 'mongoose';
// New schema for pending requests
const pendingRequestSchema = new mongoose.Schema({
  requestType: {
    type: String,
    required: true,
    // 'admin_demotion', 'user_deletion', etc.
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  targetType: {
    type: String,
    required: true, // 'user', 'problem'
  },
  reason: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  reviewedAt: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("PendingRequest", pendingRequestSchema);
