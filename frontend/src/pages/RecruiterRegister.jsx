// src/pages/RecruiterRegister.jsx
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations/motionVariants";
import API from "../api/axiosConfig";

export default function RecruiterRegister() {
  const handleSubmit = async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());

  data.role = "recruiter";

  try {
    const res = await API.post("/auth/register", data);

    localStorage.setItem("dc_token", res.data.token);

    alert("Recruiter registered successfully!");
    window.location.href = "/dashboard/recruiter";
  } catch (error) {
    alert(error.response?.data?.message || "Failed to register");
  }
};

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-2 mb-6 text-center"
      >
        <motion.h2
          variants={fadeIn(0)}
          className="text-2xl sm:text-3xl font-bold"
        >
          Recruiter Registration
        </motion.h2>
        <motion.p
          variants={fadeIn(0.1)}
          className="text-slate-300 text-xs sm:text-sm"
        >
          Post driver jobs and manage applications from one simple dashboard.
        </motion.p>
      </motion.div>

      <motion.form
        variants={fadeIn(0.15)}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit}
        className="grid sm:grid-cols-2 gap-4 bg-slate-900/80 border border-slate-700 rounded-3xl p-6 shadow-xl"
      >
        <Input label="Full Name" name="name" />
        <Input label="Company / Family Name" name="companyName" />
        <Input label="Email" name="email" type="email" />
        <Input label="Phone" name="phone" />
        <Input label="City" name="city" />
        <Input label="Password" name="password" type="password" />
        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-300 mb-1">
            About the job requirements
          </label>
          <textarea
            name="requirements"
            rows={3}
            className="w-full rounded-2xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70"
            placeholder="Type of driver you usually need, time slots, etc."
          />
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold shadow-lg shadow-emerald-500/40"
          >
            Create Recruiter Account
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}

function Input({ label, name, type = "text", ...rest }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs text-slate-300">{label}</label>
      <input
        name={name}
        type={type}
        className="w-full rounded-2xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70"
        {...rest}
      />
    </div>
  );
}
