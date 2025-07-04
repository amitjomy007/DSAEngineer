const mongoose = require("mongoose");

const editorialSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
    unique: true,
    index: true,
  },
  content: {
    type: String, // Typically Markdown or HTML content
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// Note: Mongoose automatically creates the collection name as the plural,
// lowercase version of the model name, e.g., "editorials".
module.exports = mongoose.model("Editorial", editorialSchema);