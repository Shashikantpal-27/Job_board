const Job = require("../models/job");
const Application = require("../models/application");
const User = require("../models/user");

// ================= CREATE JOB =================
exports.createJob = async (req, res) => {
  try {
    let { title, description, location, salary, start_date, deadline, company } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & Description required" });
    }

    const job = await Job.create({
      company,
      title,
      description,
      location: location || "",
      salary: salary || "",
      start_date: start_date || null,
      deadline: deadline || null,
      employer_id: req.user.id, // ✅ IMPORTANT
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.log("CREATE JOB ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL JOBS =================
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer_id", "name")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.log("GET JOBS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET MY JOBS =================
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer_id: req.user.id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.log("MY JOBS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= APPLY JOB =================
exports.applyJob = async (req, res) => {
  try {
    const resume = req.file ? req.file.filename : null;

    const application = new Application({
      job_id: req.body.job_id,         // 🔥 MUST
      candidate_id: req.user.id,       // 🔥 MUST
      name: req.body.name,
      course: req.body.course,
      dob: req.body.dob,
      college: req.body.college,
      phone: req.body.phone,
      linkedin: req.body.linkedin,
      github: req.body.github,
      resume,
    });

    await application.save();

    res.json({ message: "Applied successfully", application });

  } catch (err) {
    console.log("APPLY ERROR:", err);
    res.status(500).json({ message: "Apply failed" });
  }
};
// ================= GET APPLICANTS (FIXED) =================
exports.getApplicants = async (req, res) => {
  try {
    const job_id = req.params.id;

    // ✅ Check job ownership
    const job = await Job.findOne({
      _id: job_id,
      employer_id: req.user.id,
    });

    if (!job) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔥 FIXED QUERY
    const applications = await Application.find({ job_id })
      .populate("candidate_id", "name email")
      .populate("job_id", "title company location")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    console.log("APPLICANTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE JOB =================
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOneAndUpdate(
      { _id: id, employer_id: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.json({ message: "Job updated", job });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE JOB =================
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await Application.deleteMany({ job_id: id });

    const job = await Job.findOneAndDelete({
      _id: id,
      employer_id: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MY APPLICATIONS =================
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      candidate_id: req.user.id,
    })
      .populate("job_id", "title company location")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    console.log("MY APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE STATUS =================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("candidate_id", "email")
    .populate("job_id", "title company location");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated", application });

  } catch (error) {
    console.log("STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};