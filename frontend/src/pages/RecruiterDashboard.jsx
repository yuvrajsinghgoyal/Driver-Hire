import { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations/motionVariants";

export default function RecruiterDashboard() {
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    salaryRange: "",
    requirements: "",
    description: "",
  });

  const [myJobs, setMyJobs] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  // -------------------------------
  // Fetch jobs created by recruiter
  // -------------------------------
  const loadMyJobs = async () => {
    try {
      const res = await API.get("/jobs/my-jobs");
      setMyJobs(res.data);
    } catch (err) {
      console.log("My jobs fetch error:", err.response?.data);
    }
  };

  useEffect(() => {
    loadMyJobs();
  }, []);

  // -------------------------------
  // Create new job
  // -------------------------------
  const createJob = async () => {
    try {
      if (!jobData.title || !jobData.location || !jobData.salaryRange) {
        alert("Please fill required fields!");
        return;
      }

      await API.post("/jobs", jobData);

      alert("Job created successfully!");

      setJobData({
        title: "",
        location: "",
        salaryRange: "",
        requirements: "",
        description: "",
      });

      loadMyJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Job create failed");
    }
  };

  // -------------------------------
  // View applicants for a job
  // -------------------------------
  const openApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/${jobId}`);
      setSelectedApplicants(res.data);
      setShowApplicantsModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------------
  // Update application status
  // -------------------------------
  const updateStatus = async (applicationId, status) => {
    try {
      await API.patch(`/applications/${applicationId}/status`, { status });

      setSelectedApplicants((prev) =>
        prev.map((a) =>
          a._id === applicationId ? { ...a, status } : a
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div variants={staggerContainer} initial="hidden" animate="show">

        <motion.h2 variants={fadeIn(0)} className="text-3xl font-bold mb-6">
          Recruiter Dashboard
        </motion.h2>

        {/* ================= CREATE JOB ================= */}
        <motion.div
          variants={fadeIn(0.1)}
          className="bg-slate-900/60 border border-slate-700 p-6 rounded-3xl mb-10 shadow-xl"
        >
          <h3 className="font-semibold mb-4 text-xl text-emerald-300">
            📌 Create New Job
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              className="input-box"
              placeholder="Job title"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            />
            <input
              className="input-box"
              placeholder="Location"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
            />
            <input
              className="input-box"
              placeholder="Salary range"
              value={jobData.salaryRange}
              onChange={(e) => setJobData({ ...jobData, salaryRange: e.target.value })}
            />
            <input
              className="input-box"
              placeholder="Requirements"
              value={jobData.requirements}
              onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
            />
          </div>

          <textarea
            className="input-box w-full mb-4"
            rows="3"
            placeholder="Description"
            value={jobData.description}
            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
          />

          <button
            onClick={createJob}
            className="bg-emerald-500 px-5 py-2 rounded-full text-slate-900 font-semibold hover:bg-emerald-400"
          >
            + Create Job
          </button>
        </motion.div>

        {/* ================= POSTED JOBS ================= */}
        <motion.div variants={fadeIn(0.2)}>
          <h3 className="font-semibold text-xl mb-3 text-emerald-300">
            📂 Your Posted Jobs
          </h3>

          {myJobs.length === 0 ? (
            <p className="text-slate-400 text-sm">No jobs posted yet.</p>
          ) : (
            myJobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 mb-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">{job.title}</p>
                  <p className="text-slate-400 text-xs">{job.location}</p>
                  <p className="text-emerald-300 text-sm">{job.salaryRange}</p>
                </div>

                <button
                  onClick={() => openApplicants(job._id)}
                  className="bg-yellow-400 px-4 py-1 rounded-full text-xs font-semibold text-slate-900"
                >
                  View Applicants
                </button>
              </div>
            ))
          )}
        </motion.div>

        {/* ================= APPLICANTS MODAL ================= */}
        {showApplicantsModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-[450px]">
              <h3 className="text-lg font-semibold mb-4 text-emerald-300">
                Applicants
              </h3>

              {selectedApplicants.map((app) => (
                <div
                  key={app._id}
                  className="border border-slate-700 rounded-xl p-3 mb-3 bg-slate-950"
                >
                  <p className="font-semibold">{app.driver?.name}</p>
                  <p className="text-xs text-slate-400">{app.driver?.phone}</p>

                  {/* 💬 MESSAGE DRIVER */}
                  <button
                    onClick={() => {
                      const jobId = app.job?._id || app.job;
                      const driverId = app.driver?._id || app.driver;
                      if (!jobId || !driverId) {
                        alert('Unable to open chat: missing job or driver id');
                        return;
                      }
                      // Use recruiter-specific chat route
                      window.location.href = `/chat/recruiter/${jobId}/${driverId}`;
                    }}
                    className="mt-3 w-full bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-full text-xs font-semibold"
                  >
                    💬 Message Driver
                  </button>


                  <div className="flex gap-2 mt-3">
                    {app.status === "accepted" ? (
                      <button
                        disabled
                        className="bg-amber-700 text-white px-3 py-1 rounded-full text-xs font-semibold w-full cursor-default"
                      >
                        Accepted
                      </button>
                    ) : app.status === "rejected" ? (
                      <button
                        disabled
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold w-full cursor-default"
                      >
                        Rejected
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => updateStatus(app._id, "accepted")}
                          className="bg-emerald-500 px-3 py-1 rounded-full text-xs font-semibold w-full"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(app._id, "rejected")}
                          className="bg-red-500 px-3 py-1 rounded-full text-xs font-semibold w-full"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowApplicantsModal(false)}
                className="mt-4 w-full bg-slate-700 px-4 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
