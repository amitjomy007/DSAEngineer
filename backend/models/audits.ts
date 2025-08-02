// New schema for comprehensive audit logging
const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    // 'problem_created', 'problem_deleted', 'user_promoted', etc.
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetType: {
    type: String,
    required: true,
    // 'problem', 'user', 'system'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  metadata: {
    type: Object,
    default: {},
    // Store action-specific details
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  reversible: {
    type: Boolean,
    default: false,
    // Can this action be undone?
  }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
