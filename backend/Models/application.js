const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  course: String,
  dob: String,
  college: String,
  phone: String,
  linkedin: String,
  github: String,
  resume: String,
  status: {
    type: String,
    enum: ["applied", "selected", "rejected"],
    default: "applied",
  },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);