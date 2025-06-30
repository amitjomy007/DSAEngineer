import mongoose from "mongoose";


const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for quickly finding all submissions by a user
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true, // Index for quickly finding all submissions for a problem
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp'], // Example languages
  },
  verdict: {
    type: String,
    required: true,
    enum: [
      'Pending',
      'Accepted',
      'Wrong Answer',
      'Time Limit Exceeded',
      'Memory Limit Exceeded',
      'Runtime Error',
      'Compilation Error',
    ],
    default: 'Pending',
  },
  runtimeMs: {
    type: Number,
    default: null,
  },
  memoryKb: {
    type: Number,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Submissions", submissionSchema);
