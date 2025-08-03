import mongoose, { mongo } from "mongoose";

const problemSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
    required: true,
    // true = Active (visible to users)
    // false = Deleted/Hidden (recoverable by Super Admin)
    // We'll use this instead of separate "deleted" state
  },
  problemAuthorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemCreatedDate: {
    type: Date,
    default: Date.now,
    required: false,
  },
  problemLastModifiedDate: {
    type: Date,
    default: Date.now,
    required: false,
  },
  problemNumber: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: null,
    required: true,
  },
  titleSlug: {
    type: String,
    default: null,
    required: true,
  },
  difficulty: {
    type: String,
    default: null,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // examples is of type array corresponding to each example
  // now every example has three fields input, output, explanation
  examples: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String },
    },
  ],
  constraints: [String],

  hints: [String],
  testcases: [
    {
      input: String,
      output: String,
    },
  ],
  timeLimit: {
    type: Number,
    default: 1,
    required: false,
  },
  memoryLimit: {
    type: Number,
    default: 128,
    required: false,
  },
  allowedLanguages: {
    type: [String],
    default: ["javascript", "python", "java", "cpp"],
    required: false,
  },
  editorialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Editorial",
    required: false,
  },
});

module.exports = mongoose.model("Problem", problemSchema);
