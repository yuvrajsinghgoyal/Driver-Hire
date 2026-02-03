import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations/motionVariants";

export default function DriverApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const loadApplications = async () => {
    try {
      const res = await API.get("/applications/mine");
      setApplications(res.data);
    } catch (err) {
      console.log("Applications load error:", err);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const goToChat = (jobId, recruiterId) => {
    window.location.href = `/chat/${jobId}/${recruiterId}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div variants={staggerContainer} initial="hidden" animate="show">

        <motion.h2 variants={fadeIn(0)} className="text-2xl font-bold mb-6">
          My Applications
        </motion.h2>

        {applications.length === 0 ? (
          <p className="text-gray-600 text-sm">
            You have not applied to any job yet.
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <motion.div
                key={app._id}
                variants={fadeIn(0.1)}
                className="bg-gray-100 border border-gray-300 rounded-xl p-4 flex justify-between items-center hover:bg-gray-200"
              >
                {/* LEFT: JOB INFO */}
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedApp(app)}
                >
                  <h3 className="font-semibold text-lg hover:underline">
                    {app.job?.title}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {app.job?.location}
                  </p>
                  <p className="text-gray-900 font-semibold text-sm mt-1">
                    {app.job?.salaryRange}
                  </p>
                </div>

                {/* RIGHT: STATUS + MESSAGE */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        app.status === "accepted"
                          ? "bg-gray-600 text-white"
                          : app.status === "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                  >
                    {app.status.toUpperCase()}
                  </span>

                  {/* MESSAGE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const jobId = app.job?._id || app.job;
                      const recruiterId = app.recruiter?._id || app.recruiter || app.job?.createdBy?._id;
                      if (!jobId || !recruiterId) {
                        alert("Unable to open chat: missing job or recruiter id");
                        return;
                      }
                      window.location.href = `/chat/${jobId}/${recruiterId}`;
                    }}
                    className="mt-2 bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  >
                    Message Recruiter
                  </button>


                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* =========================
          JOB DETAILS MODAL
      ========================== */}
      {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-3xl p-6 w-[420px] shadow-xl">

            <h2 className="text-xl font-bold mb-2">
              {selectedApp.job?.title}
            </h2>

            <p className="text-gray-900 text-sm mb-1">
              <strong>Location:</strong> {selectedApp.job?.location}
            </p>

            <p className="text-gray-900 text-sm mb-1">
              <strong>Salary:</strong> {selectedApp.job?.salaryRange}
            </p>

            <p className="text-gray-900 text-sm mb-1">
              <strong>Requirements:</strong>{" "}
              {selectedApp.job?.requirements || "Not specified"}
            </p>

            <p className="text-gray-900 text-sm mb-3">
              <strong>Description:</strong>{" "}
              {selectedApp.job?.description || "No description"}
            </p>

            {/* STATUS */}
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    selectedApp.status === "accepted"
                      ? "bg-gray-600 text-white"
                      : selectedApp.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
              >
                {selectedApp.status.toUpperCase()}
              </span>


                  <button
                    onClick={() => {
                      const jobId = selectedApp.job?._id || selectedApp.job;
                      const recruiterId = selectedApp.recruiter?._id || selectedApp.recruiter || selectedApp.job?.createdBy?._id;
                      if (!jobId || !recruiterId) {
                        alert('Unable to open chat: missing job or recruiter id');
                        return;
                      }
                      window.location.href = `/chat/${jobId}/${recruiterId}`;
                    }}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-full text-xs font-semibold mt-2"
                  >
                    💬 Message Recruiter
                  </button>





            </div>

            {/* MESSAGE RECRUITER */}
            {selectedApp.job?.createdBy?._id && (
              <button
                onClick={() =>
                  goToChat(
                    selectedApp.job._id,
                    selectedApp.job.createdBy._id
                  )
                }
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-full font-semibold mb-3"
              >
                Message Recruiter
              </button>
            )}

            <button
              className="w-full bg-red-500 py-2 rounded-full font-semibold text-sm"
              onClick={() => setSelectedApp(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
