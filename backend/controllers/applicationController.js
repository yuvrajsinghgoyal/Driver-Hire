import Application from "../models/Application.js";
import Job from "../models/Job.js";

// -------------------------
// 1. Driver applies to job
// -------------------------
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Prevent duplicate apply
    const already = await Application.findOne({
      job: jobId,
      driver: req.user._id,
    });

    if (already)
      return res.status(400).json({ message: "Already applied to this job" });

    const newApp = await Application.create({
      job: jobId,
      driver: req.user._id,
      recruiter: job.createdBy,
    });

    res.json(newApp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------------
// 2. Driver: Get all applications he has applied to
// ------------------------------------------------
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ driver: req.user._id })
      .populate({
        path: "job",
        populate: {
          path: "createdBy",
          select: "_id name",
        },
      });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ---------------------------------------------
// 3. Recruiter: Get applicants of a specific job
// ---------------------------------------------
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only job owner can view applicants
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const apps = await Application.find({ job: jobId })
      .populate("driver", "name phone");

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------------------------------
// 4. Recruiter: Get applications for ALL jobs created by him
// -------------------------------------------------------------
export const getApplicationsForMyJobs = async (req, res) => {
  try {
    const myJobs = await Job.find({ createdBy: req.user._id });

    const jobIds = myJobs.map((job) => job._id);

    const apps = await Application.find({ job: { $in: jobIds } })
      .populate("driver", "name phone")
      .populate("job", "title location");

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------------------------------
// 5. Recruiter update application status (Accept/Reject)
// -------------------------------------------------------------
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const job = await Job.findById(app.job);

    if (job.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    app.status = status;
    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
