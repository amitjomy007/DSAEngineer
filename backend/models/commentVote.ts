import mongoose from "mongoose";

const commentVoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  vote: {
    type: Number,
    enum: [1, -1],
    required: true,
  },
}, { timestamps: true });

// Compound unique index to prevent duplicate votes
commentVoteSchema.index({ userId: 1, commentId: 1 }, { unique: true });

export default mongoose.model("CommentVote", commentVoteSchema);
