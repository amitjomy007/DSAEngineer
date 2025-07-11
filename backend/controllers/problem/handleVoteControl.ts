const Problem = require("../../models/problem");
const problemUpVote = require("../../models/problemUpVote");
const problemDownVote = require("../../models/problemDownVote");
export const handleVoteControl = async (req: any, res: any) => {
  try {
    const { userId, problemId, voteType } = req.body; // voteType: "upvote" | "downvote"

    if (!userId || !problemId || !["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Remove any existing vote by this user for this problem
    await problemUpVote.deleteOne({ userId, problemId });
    await problemDownVote.deleteOne({ userId, problemId });

    let upvoteCount = 0;
    let downvoteCount = 0;

    if (voteType === "upvote") {
      await problemUpVote.create({ userId, problemId });
    } else if (voteType === "downvote") {
      await problemDownVote.create({ userId, problemId });
    }

    upvoteCount = await problemUpVote.countDocuments({ problemId });
    downvoteCount = await problemDownVote.countDocuments({ problemId });

    // // Optionally update Problem document's upvote/downvote counts
    // await Problem.findByIdAndUpdate(problemId, {
    //   upvoteCount,
    //   downvoteCount,
    // });
    // this thing doesn't exist in the schema, so we don't do it

    return res.status(200).json({
      message: "Vote registered",
      upvoteCount,
      downvoteCount,
      voteType,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
