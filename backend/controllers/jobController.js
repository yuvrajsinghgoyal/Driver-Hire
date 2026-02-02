// backend/controllers/jobController.js
import Job from "../models/Job.js";

// ------------------ CREATE JOB ------------------
export const createJob = async (req, res) => {
  try {
    const { title, location, salaryRange, requirements, description } = req.body;

    if (!title || !location || !salaryRange) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = await Job.create({
      title,
      location,
      salaryRange,
      requirements,
      description,
      createdBy: req.user.id,  // use createdBy (matches Job model)
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET ALL JOBS ------------------
export const getAllJobs = async (req, res) => {
  try {
    // Optionally populate the creator if you want to show recruiter info on job cards
    const jobs = await Job.find().sort({ createdAt: -1 }).populate("createdBy", "name city");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// ------------------ GET SINGLE JOB ------------------
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "_id name city");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET MY JOBS (RECRUITER) ------------------
export const getMyJobs = async (req, res) => {
  try {
    // find jobs posted by this recruiter (createdBy)
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recruiter jobs" });
  }
};

// ------------------ UPDATE JOB ------------------
export const updateJob = async (req, res) => {
  try {
    // Ensure only the owner (createdBy) can update
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found or you are not authorized" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

// ------------------ DELETE JOB ------------------
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found or you are not authorized" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};
