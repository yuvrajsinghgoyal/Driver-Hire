// src/pages/DriverRegister.jsx
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations/motionVariants";
import API from "../api/axiosConfig";

export default function DriverRegister() {
  // For now, just console.log on submit – later we’ll connect backend
  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());

  // Fix: Convert numeric fields properly
  if (data.experience) data.experience = Number(data.experience);

  // Required field by backend
  data.role = "driver";

  try {
    const res = await API.post("/auth/register", data);

    localStorage.setItem("dc_token", res.data.token);

    alert("Driver registered successfully!");
    window.location.href = "/dashboard/driver";
  } catch (error) {
    console.error("REGISTER ERROR FULL:", error);
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
          Driver Registration
        </motion.h2>
        <motion.p
          variants={fadeIn(0.1)}
          className="text-slate-300 text-xs sm:text-sm"
        >
          Create your driver profile so recruiters can find and hire you.
        </motion.p>
      </motion.div>

      <motion.form
        variants={fadeIn(0.15)}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit}
        className="grid sm:grid-cols-2 gap-4 bg-slate-900/80 border border-slate-700 rounded-3xl p-6 shadow-xl"
      >
        <Input label="Full Name" name="name" placeholder="Yuvraj Singh" />
        <Input label="Email" name="email" type="email" />
        <Input label="Phone" name="phone" placeholder="98xxxxxxx" />
        <Input label="City" name="city" placeholder="Indore" />
        <Input
          label="Experience (years)"
          name="experience"
          type="number"
          min="0"
        />
        <Input label="License Number" name="licenseNumber" />
        <Input label="Vehicle Type" name="vehicleType" placeholder="Car/Bike" />
        <Input label="Password" name="password" type="password" />

        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-300 mb-1">
            Short Bio / Extra Details
          </label>
          <textarea
            name="bio"
            rows={3}
            className="w-full rounded-2xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70"
            placeholder="Mention your driving experience, known routes, languages, etc."
          />
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold shadow-lg shadow-emerald-500/40"
          >
            Create Driver Profile
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
