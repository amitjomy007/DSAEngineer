import mongoose from "mongoose";
import { stderr } from "process";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for quickly finding all submissions by a user
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
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
      enum: ["javascript", "python", "java", "cpp"], // Example languages
    },
    verdict: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
      ],
      default: "Pending",
    },
    totalTestCases: {
      type: Number,
      default: null,
    },
    passedTestCases: {
      type: Number,
      default: null,
    },

    //only for accepted submissions
    runtimeMs: {
      type: Number,
      default: null,
    },
    memoryKb: {
      type: Number,
      default: null,
    },

    //only for testcases with wrong Output
    failedTestCase: {
      number: {
        type: Number,
        default: null,
      },
      input: {
        type: String,
        default: null,
      },
      requiredOutput: {
        type: String,
        default: null,
      },
      receivedOutput: {
        type: String,
        default: null,
      },
    },
    //only for compilation Error
    compileError: {
      stderr: String,
    },
    // Only if Runtime Error
    runTimeError: {
      message: String,
      signal: String,
      stderr: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submissions", submissionSchema);
