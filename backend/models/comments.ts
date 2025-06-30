import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true, // Index for quickly fetching all comments for a problem
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    // For nested comments/replies
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // A top-level comment has no parent
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", commentSchema);
