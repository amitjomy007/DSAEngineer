import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
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
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true, // Index for quickly fetching replies
    },
  },
  { timestamps: true }
);

// Compound index for efficient querying
commentSchema.index({ problemId: 1, parentId: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
