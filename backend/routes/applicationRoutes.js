import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicants,
  getApplicationsForMyJobs,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// DRIVER APPLY
router.post("/", protect, requireRole("driver"), applyToJob);

// DRIVER: SEE HIS APPLICATIONS
router.get("/mine", protect, requireRole("driver"), getMyApplications);

// RECRUITER: SEE ALL APPLICANTS ON A SPECIFIC JOB
router.get("/:jobId", protect, requireRole("recruiter"), getApplicants);

// RECRUITER: SEE ALL APPLICATIONS ACROSS ALL HIS JOBS
router.get("/received/all", protect, requireRole("recruiter"), getApplicationsForMyJobs);

// RECRUITER: UPDATE STATUS (ACCEPT / REJECT)
router.patch("/:id/status", protect, requireRole("recruiter"), updateApplicationStatus);

export default router;
