// src/components/JobCard.jsx
import React from "react";

export default function JobCard({ job, onEdit, onDelete, showActions = false }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4 mb-4 flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-white">{job.title}</h3>
        <p className="text-slate-400 text-xs">{job.location} • {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</p>
        {job.requirements && <p className="text-slate-300 text-sm mt-2">{job.requirements}</p>}
      </div>

      <div className="text-right">
        <div className="text-emerald-300 font-semibold">{job.salaryRange || "Negotiable"}</div>

        {showActions && (
          <div className="mt-3 space-x-2">
            <button
              onClick={() => onEdit(job)}
              className="px-3 py-1 rounded-md bg-slate-700 text-slate-100 text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(job._id)}
              className="px-3 py-1 rounded-md bg-red-600 text-white text-xs"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
