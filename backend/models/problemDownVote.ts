import mongoose from "mongoose";
const problemDownVoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },
});
module.exports = mongoose.model("problemDownVote", problemDownVoteSchema);
