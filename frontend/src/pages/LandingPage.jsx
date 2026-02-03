import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";

export default function LandingPage() {
  const [role, setRole] = useState(null);
  const [jobs, setJobs] = useState([]);

  // ➤ Fetch role from backend using token
  useEffect(() => {
    const token = localStorage.getItem("dc_token");
    if (!token) return;

    API.get("/auth/me")
      .then((res) => setRole(res.data.user.role))
      .catch(() => setRole(null));
  }, []);

  // ➤ Fetch jobs only for Driver
  useEffect(() => {
    if (role === "driver") {
      API.get("/jobs")
        .then((res) => setJobs(res.data))
        .catch(() => {});
    }
  }, [role]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-900">

      <h1 className="text-4xl font-bold mb-4">
        Find trusted <span className="text-gray-600">drivers</span> & jobs in minutes.
      </h1>

      <p className="text-gray-600 max-w-xl">
        Whether you're a driver or a recruiter — DriveConnect helps you find the right match instantly.
      </p>

      {/* -----------------------------------
        ROLE-BASED UI SECTION
      ------------------------------------*/}

      {/* 🔹 SHOW WHEN NO ONE IS LOGGED IN */}
      {!role && (
        <div className="flex flex-col sm:flex-row items-start gap-10 mt-8">
          <div className="flex flex-col items-start gap-4">
            <Link
              to="/choose-role"
              className="w-64 text-left px-8 py-3 rounded-2xl bg-gray-600 text-white font-semibold text-lg shadow-lg"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="w-64 text-left px-8 py-3 rounded-2xl bg-white text-gray-900 border border-gray-300 text-lg shadow-inner"
            >
              Already registered? Login
            </Link>
          </div>

          {/* Larger illustration placed to the right with gap */}
          <div className="flex-1 max-w-3xl ml-4">
            <svg
              width="100%"
              height="320"
              viewBox="0 0 820 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#9CA3AF" />
                  <stop offset="100%" stopColor="#4B5563" />
                </linearGradient>
                <filter id="s" x="0" y="0" width="200%" height="200%">
                  <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* road shadow */}
              <rect x="0" y="240" width="820" height="60" fill="#000000" opacity="0.04" />

              {/* large car base */}
              <g filter="url(#s)">
                <rect x="80" y="110" rx="24" width="660" height="80" fill="#f3f4f6" />
                <path d="M160 110 Q260 60 410 60 Q560 60 700 110 Z" fill="url(#g1)" />
              </g>

              {/* windows */}
              <rect x="260" y="92" width="92" height="36" rx="8" fill="#e6fffa" opacity="0.95" />
              <rect x="364" y="92" width="92" height="36" rx="8" fill="#e6fffa" opacity="0.95" />
              <rect x="468" y="92" width="92" height="36" rx="8" fill="#e6fffa" opacity="0.95" />

              {/* wheels */}
              <circle cx="260" cy="260" r="28" fill="#374151" />
              <circle cx="560" cy="260" r="28" fill="#374151" />
              <circle cx="260" cy="260" r="10" fill="#9ca3af" />
              <circle cx="560" cy="260" r="10" fill="#9ca3af" />

              {/* driver character */}
              <circle cx="300" cy="84" r="18" fill="#fde68a" />
              <rect x="288" y="106" width="24" height="12" rx="4" fill="#fca5a5" />

              {/* subtle shine */}
              <ellipse cx="420" cy="120" rx="160" ry="28" fill="#ffffff" opacity="0.04" />
            </svg>
          </div>
        </div>
      )}

      {/* =========================
          Scenic footer (mountains + forest)
      ========================== */}
      <div className="mt-12 w-full">
        <svg
          width="100%"
          height="220"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <linearGradient id="mount" x1="0" x2="1">
              <stop offset="0%" stopColor="#eef2f7" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
            <linearGradient id="tree" x1="0" x2="1">
              <stop offset="0%" stopColor="#c7efd6" />
              <stop offset="100%" stopColor="#9bd6a5" />
            </linearGradient>
          </defs>

          {/* sky */}
          <rect width="1440" height="320" fill="url(#sky)" />

          {/* distant mountains (light) */}
          <path d="M0 220 L140 120 L280 220 L420 120 L560 220 L700 100 L840 220 L980 140 L1120 220 L1260 150 L1440 220 L1440 320 L0 320 Z" fill="#e6eef3" opacity="0.95" />

          {/* mid mountains (muted gradient) */}
          <path d="M0 240 L120 160 L240 240 L360 160 L480 240 L600 140 L720 240 L840 160 L960 240 L1080 170 L1200 240 L1320 180 L1440 240 L1440 320 L0 320 Z" fill="url(#mount)" opacity="0.95" />

          {/* foreground forest (soft green/gray) */}
          <g fill="url(#tree)">
            <path d="M40 280 L60 230 L80 280 Z" />
            <path d="M80 280 L100 230 L120 280 Z" />
            <path d="M160 280 L180 220 L200 280 Z" />
            <path d="M260 280 L280 210 L300 280 Z" />
            <path d="M380 280 L400 200 L420 280 Z" />
            <path d="M520 280 L540 210 L560 280 Z" />
            <path d="M700 280 L720 200 L740 280 Z" />
            <path d="M860 280 L880 210 L900 280 Z" />
            <path d="M1040 280 L1060 220 L1080 280 Z" />
            <path d="M1200 280 L1220 230 L1240 280 Z" />
            <path d="M1360 280 L1380 240 L1400 280 Z" />
          </g>

          {/* subtle ground (light) */}
          <rect y="280" width="1440" height="40" fill="#f1f5f9" />
        </svg>
      </div>

      {/* 🔹 DRIVER VIEW */}
      {role === "driver" && (
        <div className="mt-10 bg-gray-100 border border-gray-300 rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-3">Available Jobs</h2>

          {jobs.length === 0 && <p className="text-gray-600">No jobs available</p>}

          {jobs.map((job) => (
            <div
              key={job._id}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-3 bg-white"
            >
              <p className="font-semibold">{job.title}</p>
              <p className="text-gray-600 text-sm">{job.location}</p>
              <p className="text-gray-900 text-sm">{job.salaryRange}</p>
            </div>
          ))}

          <Link
            to="/dashboard/driver"
            className="block mt-4 px-6 py-2 rounded-full bg-gray-600 text-white font-semibold text-center"
          >
            Explore all jobs
          </Link>
        </div>
      )}

      {/* 🔹 RECRUITER VIEW */}
        {role === "recruiter" && (
        <div className="mt-10 bg-gray-100 border border-gray-300 rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-3">Recruiter Panel</h2>

          <div className="flex gap-4">
            <Link
              to="/dashboard/recruiter"
              className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold"
            >
              Create New Job
            </Link>

            <Link
              to="/dashboard/recruiter"
              className="px-6 py-2 rounded-full bg-white text-gray-900 border border-gray-300"
            >
              View Applications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
