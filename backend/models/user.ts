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
});

module.exports = mongoose.model("User", userSchema);
