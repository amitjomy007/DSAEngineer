import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: null,
    required: true,
  },
  lastname: {
    type: String,
    default: null,
    required: true,
  },
  email: {
    type: String,
    default: null,
    required: true,
    unique: true, // email is unique
  },
  password: {
    type: String,
    default: null,
    required: true,
  },
  token : {
    type: String,
    default: null,
    required: false,
  
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
  // --- Fields for Tracking User Progress & Activity ---
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
  }],
  attemptedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
  }],
  bookmarkedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
  }],

}, { timestamps: true } );

module.exports = mongoose.model("User", userSchema);
