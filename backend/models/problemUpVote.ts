import mongoose from "mongoose";
const problemUpVoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },
});
module.exports = mongoose.model("problemUpVote", problemUpVoteSchema);
