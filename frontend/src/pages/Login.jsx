import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosConfig";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "driver", // ✅ DEFAULT (IMPORTANT)
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ DEBUG (DO NOT REMOVE UNTIL STABLE)
    console.log("LOGIN DATA:", form);

    if (!form.email || !form.password || !form.role) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // ✅ SAVE TOKEN + USER
      localStorage.setItem("dc_token", res.data.token);
      localStorage.setItem("dc_user", JSON.stringify(res.data.user));

      // Ensure API uses the token for subsequent requests immediately
      try {
        API.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
      } catch (e) {
        // ignore in non-browser environments
      }

      // ✅ REDIRECT BASED ON ROLE
      if (res.data.user.role === "driver") {
        window.location.href = "/dashboard/driver";
      } else {
        window.location.href = "/dashboard/recruiter";
      }

    } catch (error) {
      console.error("Login error:", error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-2xl border border-gray-300 space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-gray-900">Login</h1>

        <div>
          <label className="text-xs text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">Login as</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900"
          >
            <option value="driver">Driver</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 py-2 rounded-xl text-white font-semibold"
        >
          Login
        </button>
      </motion.form>
    </div>
  );
}
