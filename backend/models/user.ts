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
});

module.exports = mongoose.model("User", userSchema);
