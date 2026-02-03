// src/components/JobCard.jsx
import React from "react";

export default function JobCard({ job, onEdit, onDelete, showActions = false }) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-2xl p-4 mb-4 flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-gray-900">{job.title}</h3>
        <p className="text-gray-900 text-xs">{job.location} • {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</p>
        {job.requirements && <p className="text-gray-900 text-sm mt-2">{job.requirements}</p>}
      </div>

      <div className="text-right">
        <div className="text-gray-900 font-semibold">{job.salaryRange || "Negotiable"}</div>

        {showActions && (
          <div className="mt-3 space-x-2">
            <button
              onClick={() => onEdit(job)}
              className="px-3 py-1 rounded-md bg-gray-600 text-gray-900 text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(job._id)}
              className="px-3 py-1 rounded-md bg-red-600 text-gray-900 text-xs"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
