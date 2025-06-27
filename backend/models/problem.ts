import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
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
      default: null,
      required: true,
    },
  ],
  description: {
    type: String,
    default: null,
    required: true,
  },
  // examples is of type array corresponding to each example
  // now every example has three fields input, output, explanation
  examples: [
    {
      id: {
        type: String,
        default: null,
        required: true,
      },
      input: {
        type: String,
        default: null,
        required: true,
      },
      output: {
        type: String,
        default: null,
        required: true,
      },
      explanation: {
        type: String,
        default: null,
        required: false,
      },
    },
  ],
  constraints: {
    type: String,
    default: null,
    required: false,
  },
  hints: [
    {
      id: {
        type: String,
        default: null,
        required: false,
      },
      text: {
        type: String,
        default: null,
        required: false,
      },
    },
  ],
  testcases: [
    {
      type: String,
      default: null,
      required: true,
    },
  ],
  testcaseOutputs: [
    {
      type: String,
      default: null,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Problem", problemSchema);
