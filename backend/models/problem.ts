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
      id: {
        type: String,
        default: null,
        required: true,
      },
      tag: {
        type: String,
        default: null,
        required: true,
      },
      color: {
        type: String,
        default: null,
        required: true,
      },
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
        default: Date.now(),
        required: false,
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
        default: Date.now(),
        required: false,
      },
      hint: {
        type: String,
        default: null,
        required: false,
      },
    },
  ],
  testcases: [{
    id: {
      type: String,
      default: Date.now(),
      required: false,
    },
    testcase: {
      type: String,
      default: null,
      required: true,
    }
}
  ],
  testcaseOutputs:  [{
    id: {
      type: String,
      default: Date.now(),
      required: false,
    },
    testcaseOutput: {
      type: String,
      default: null,
      required: true,
    }
}
  ],
});

module.exports = mongoose.model("Problem", problemSchema);
