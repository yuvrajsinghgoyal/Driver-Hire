// src/pages/DriverDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations/motionVariants";

export default function DriverDashboard() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // -----------------------------
  // Fetch all jobs
  // -----------------------------
  const loadJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log("Jobs load error:", err);
    }
  };

  // -----------------------------
  // Fetch my applications (with status)
  // -----------------------------
  const loadMyApplications = async () => {
    try {
      const res = await API.get("/applications/mine");

      setMyApplications(res.data);

      // Extract job IDs to check if already applied
      const appliedIds = res.data.map((app) => app.job?._id);
      setAppliedJobs(appliedIds);

    } catch (err) {
      console.log("My applications load error:", err);
    }
  };

  useEffect(() => {
    loadJobs();
    const user = JSON.parse(localStorage.getItem("dc_user"));
    if (user?.role === "driver") loadMyApplications();
  }, []);

  // -----------------------------
  // Apply for a job
  // -----------------------------
  const applyJob = async (jobId) => {
    try {
      await API.post("/applications", { jobId });
      alert("Applied successfully!");
      loadMyApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div variants={staggerContainer} initial="hidden" animate="show">

        {/* AVAILABLE JOBS */}
        <motion.h2 variants={fadeIn(0)} className="text-2xl font-bold mb-4">
          Available Jobs
        </motion.h2>

        {jobs.length === 0 && (
          <p className="text-gray-600 text-sm">No jobs posted yet.</p>
        )}

        {/* JOB LIST */}
        <div className="space-y-3">
          {jobs.map((job) => {
            const alreadyApplied = appliedJobs.includes(job._id);

            return (
              <motion.div
                key={job._id}
                variants={fadeIn(0.1)}
                className="bg-gray-100 border border-gray-300 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200"
              >
                {/* Clicking job title → open details */}
                <div onClick={() => setSelectedJob(job)}>
                  <h3 className="font-semibold text-lg hover:underline">{job.title}</h3>
                  <p className="text-gray-600 text-xs">{job.location}</p>
                  <p className="text-gray-900 font-semibold text-sm mt-1">
                    {job.salaryRange}
                  </p>
                </div>

                {/* APPLY BUTTON */}
                {alreadyApplied ? (
                  <span className="px-4 py-1 rounded-full bg-gray-600 text-white text-xs font-semibold">
                    Applied
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      applyJob(job._id);
                    }}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow"
                  >
                    Apply
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ===========================
            MY APPLICATIONS SECTION
        ============================ */}
        <motion.h2 variants={fadeIn(0.2)} className="text-2xl font-bold mt-10 mb-3">
          My Applications
        </motion.h2>

        {myApplications.length === 0 ? (
          <p className="text-gray-600 text-sm">You haven't applied to any jobs yet.</p>
        ) : (
          myApplications.map((app) => (
            <motion.div
              key={app._id}
              variants={fadeIn(0.15)}
              className="bg-gray-100 border border-gray-300 rounded-xl p-4 mb-3"
            >




            <div>
              <p className="font-semibold text-lg">{app.job?.title}</p>
              <p className="text-gray-600 text-xs">{app.job?.location}</p>

              {/* STATUS BADGE */}

          </div>

           

                  {/* RIGHT SIDE BUTTON */}
                


              {/* STATUS BADGE */}
              <span
                className={`
                  inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold
                  ${app.status === "pending" && "bg-yellow-500/20 text-yellow-300"}
                  ${app.status === "accepted" && "bg-gray-600/20 text-gray-600"}
                  ${app.status === "rejected" && "bg-red-500/20 text-red-300"}
                `}
              >
                {app.status.toUpperCase()}
              </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const jobId = app.job?._id || app.job;
                    const recruiterId = app.job?.createdBy?._id || app.recruiter || app.recruiter?._id;
                    if (!jobId || !recruiterId) {
                      alert('Unable to open chat: missing job or recruiter id');
                      return;
                    }
                    window.location.href = `/chat/${jobId}/${recruiterId}`;
                  }}
                  className="bg-gray-600 px-4 py-1 rounded-full text-xs font-semibold text-white ml-2"
                >
                  Message Recruiter
                </button>



            </motion.div>
          ))
        )}
      </motion.div>

      {/* JOB DETAILS POPUP */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-3xl p-6 w-[420px] shadow-xl">

            <h2 className="text-xl font-bold mb-2">{selectedJob.title}</h2>
            <p className="text-gray-900 text-sm mb-1"><strong>Location:</strong> {selectedJob.location}</p>
            <p className="text-gray-900 text-sm mb-1"><strong>Salary:</strong> {selectedJob.salaryRange}</p>
            <p className="text-gray-900 text-sm mb-1"><strong>Requirements:</strong> {selectedJob.requirements || "Not specified"}</p>
            <p className="text-gray-900 text-sm mb-3"><strong>Description:</strong> {selectedJob.description || "No description"}</p>

            {/* Apply Button inside popup */}
            {appliedJobs.includes(selectedJob._id) ? (
              <span className="px-4 py-2 block text-center rounded-full bg-gray-600 text-white text-sm font-semibold mb-3">
                Already Applied
              </span>
            ) : (
              <button
                onClick={() => applyJob(selectedJob._id)}
                className="w-full bg-gray-600 text-white py-2 rounded-full font-semibold mb-3 hover:bg-gray-500"
              >
                Apply Now
              </button>
            )}

            <button
              className="w-full bg-red-500 py-2 rounded-full font-semibold text-sm"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
