import mongoose from "mongoose";
const commentVoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  vote: {
    type: Number,
    enum: [1, -1],
  }, // 1 = up, -1 = down
});

module.exports = mongoose.model("CommentVote", commentVoteSchema);
