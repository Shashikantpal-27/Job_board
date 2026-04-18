const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: String,
  title: String,
  description: String,
  location: String,
  salary: String,
  start_date: String,
  deadline: String,
  employer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);