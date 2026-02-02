// backend/routes/jobRoutes.js
import express from "express";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobById,
} from "../controllers/jobController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: list all jobs (drivers will use)
router.get("/", getAllJobs);
// Public: get jobs owned by the authenticated recruiter
router.get("/my-jobs", protect, requireRole("recruiter"), getMyJobs);

// Public: get single job by id (must be after more specific routes)
router.get("/:id", getJobById);

// Protected recruiter routes
router.post("/", protect, requireRole("recruiter"), createJob);
router.put("/:id", protect, requireRole("recruiter"), updateJob);
router.delete("/:id", protect, requireRole("recruiter"), deleteJob);
export default router;
