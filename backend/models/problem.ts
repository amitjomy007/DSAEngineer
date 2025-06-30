import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
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
});

module.exports = mongoose.model("Problem", problemSchema);
