import mongoose from "mongoose";
const tagSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  color: String, // for frontend UI badge color
});

module.exports = mongoose.model("Tag", tagSchema);