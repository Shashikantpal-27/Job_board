const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const jobController = require("../controllers/jobController");
console.log("Job Routes Working");
console.log("🔥 jobRoutes loaded");
// JOB
router.post("/jobs", auth, role("employer"), jobController.createJob);
router.get("/jobs", jobController.getJobs);
router.put("/jobs/:id", auth, role("employer"), jobController.updateJob);
router.delete("/jobs/:id", auth, role("employer"), jobController.deleteJob);

// APPLY
router.post(
  "/jobs/:id/apply",
  auth,
  role("candidate"),
  upload.single("resume"),
  jobController.applyJob
);

// APPLICANTS
router.get(
  "/jobs/:id/applicants",
  auth,
  role("employer"),
  jobController.getApplicants
);

// STATUS
router.put(
  "/applications/:id",
  auth,
  role("employer"),
  jobController.updateApplicationStatus
);

// TRACK
router.get(
  "/my-applications",
  auth,
  jobController.getMyApplications
);

router.get("/my-jobs", auth, role("employer"), jobController.getMyJobs);

module.exports = router;