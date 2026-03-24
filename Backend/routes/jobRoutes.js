const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// 🔥 SAFE IMPORT (no destructuring issues)
const jobController = require("../controllers/jobController");


// ================= JOB ROUTES =================

// ✅ Create Job (Employer only)
router.post(
  "/jobs",
  authMiddleware,
  roleMiddleware("employer"),
  jobController.createJob
);

// ✅ Get All Jobs (Public)
router.get("/jobs", jobController.getJobs);


// ================= APPLY ROUTES =================

// ✅ Apply Job (Candidate + Resume Upload)
router.post(
  "/apply",
  authMiddleware,
  roleMiddleware("candidate"),
  upload.single("resume"),
  jobController.applyJob
);


// ================= CANDIDATE =================

// ✅ My Applications (Tracking)
router.get(
  "/my-applications",
  authMiddleware,
  jobController.getMyApplications
);


// ================= EMPLOYER =================

// ✅ Get Applicants
router.get(
  "/applicants",
  authMiddleware,
  roleMiddleware("employer"),
  jobController.getApplicants
);

// ✅ Update Job
router.put(
  "/jobs/:id",
  authMiddleware,
  roleMiddleware("employer"),
  jobController.updateJob
);

// ✅ Delete Job
router.delete(
  "/jobs/:id",
  authMiddleware,
  roleMiddleware("employer"),
  jobController.deleteJob
);

// ✅ Update Application Status (Select/Reject)
router.put(
  "/applications/:id",
  authMiddleware,
  jobController.updateApplicationStatus
);

module.exports = router;