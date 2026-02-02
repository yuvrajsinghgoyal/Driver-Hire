import { useState } from "react";
import API from "../api/axiosConfig";

export default function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salaryRange: "",
    description: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", form);
      alert("Job posted successfully!");
      window.location.href = "/dashboard/recruiter";
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900 p-6 rounded-2xl border border-slate-700 mt-8">
      <h2 className="text-xl font-bold mb-4">Post a New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Job Title"
          className="w-full p-2 rounded bg-slate-800 border border-slate-600"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          className="w-full p-2 rounded bg-slate-800 border border-slate-600"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="salaryRange"
          placeholder="Salary Range (e.g. ₹20k - ₹30k)"
          className="w-full p-2 rounded bg-slate-800 border border-slate-600"
          value={form.salaryRange}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Job Description"
          className="w-full p-2 rounded bg-slate-800 border border-slate-600"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />

        <textarea
          name="requirements"
          placeholder="Candidate Requirements"
          className="w-full p-2 rounded bg-slate-800 border border-slate-600"
          rows="3"
          value={form.requirements}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-black py-2 rounded font-semibold"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
