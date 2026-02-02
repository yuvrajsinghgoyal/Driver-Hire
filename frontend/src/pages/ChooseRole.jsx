// src/pages/ChooseRole.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  fadeIn,
  popIn,
  staggerContainer,
} from "../animations/motionVariants";

export default function ChooseRole() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="text-center space-y-4 mb-8"
      >
        <motion.h2
          variants={fadeIn(0)}
          className="text-2xl sm:text-3xl font-bold"
        >
          How do you want to use{" "}
          <span className="text-emerald-400">DriveConnect</span>?
        </motion.h2>
        <motion.p
          variants={fadeIn(0.1)}
          className="text-slate-300 text-sm max-w-2xl mx-auto"
        >
          Choose whether you are looking for a driver job or you want to hire a
          driver for yourself, your company, or your family.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Driver Card */}
        <RoleCard
          to="/register/driver"
          title="I am a Driver"
          subtitle="Looking for driving job"
          points={[
            "Create your profile once",
            "Apply to multiple jobs",
            "Highlight your experience & license",
          ]}
          icon="🚗"
        />
        {/* Recruiter Card */}
        <RoleCard
          to="/register/recruiter"
          title="I want to Hire"
          subtitle="Looking for a driver"
          points={[
            "Post job in under 2 minutes",
            "View verified driver profiles",
            "Shortlist, contact & hire quickly",
          ]}
          icon="🧑‍💼"
        />
      </div>
    </div>
  );
}

function RoleCard({ to, title, subtitle, points, icon }) {
  return (
    <motion.div
      variants={popIn(0.1)}
      initial="hidden"
      animate="show"
      whileHover={{ y: -4, scale: 1.01 }}
      className="border border-slate-700 rounded-3xl p-6 bg-slate-900/80 shadow-lg shadow-slate-900/70 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-left">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
      <ul className="text-xs text-slate-300 space-y-1.5 flex-1">
        {points.map((p) => (
          <li key={p} className="flex gap-2 items-start">
            <span className="mt-[2px] text-emerald-400">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className="mt-5 inline-flex justify-center items-center px-4 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-semibold hover:scale-[1.02] active:scale-95 transition"
      >
        Continue
      </Link>
    </motion.div>
  );
}
