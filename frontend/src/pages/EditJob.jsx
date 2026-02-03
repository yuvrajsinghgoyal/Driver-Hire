import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";

export default function EditJob() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    API.get(`/jobs`)
      .then((res) => {
        const job = res.data.find((j) => j._id === id);
        setForm(job);
      })
      .catch(() => alert("Failed to load job details"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/jobs/${id}`, form);
    alert("Job updated!");
    window.location.href = "/dashboard/recruiter";
  };

  if (!form) return <p className="text-center p-5">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-300 p-6 rounded-2xl mt-8">
      <h2 className="text-xl font-bold mb-4">Edit Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          className="w-full bg-white border border-gray-300 p-2 rounded text-gray-900"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="location"
          className="w-full bg-white border border-gray-300 p-2 rounded text-gray-900"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="salaryRange"
          className="w-full bg-white border border-gray-300 p-2 rounded text-gray-900"
          value={form.salaryRange}
          onChange={handleChange}
        />

        <textarea
          name="description"
          rows="3"
          className="w-full bg-white border border-gray-300 p-2 rounded text-gray-900"
          value={form.description}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-gray-600 text-white p-2 rounded font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
