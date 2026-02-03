// src/pages/MyProfile.jsx
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations/motionVariants";

export default function MyProfile() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Load current user from localStorage or /api/auth/me
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("dc_user"));
    if (local) {
      setUser(local);
      setForm({
        name: local.name || "",
        phone: local.phone || "",
        city: local.city || "",
        bio: local.bio || "",
        experience: local.experience || "",
        licenseNumber: local.licenseNumber || "",
        vehicleType: local.vehicleType || "",
        companyName: local.companyName || "",
        requirements: local.requirements || "",
      });
      setPreview(local.profilePic || null);
    } else {
      // fallback: fetch from API
      API.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          setForm({
            name: res.data.user.name || "",
            phone: res.data.user.phone || "",
            city: res.data.user.city || "",
            bio: res.data.user.bio || "",
            experience: res.data.user.experience || "",
            licenseNumber: res.data.user.licenseNumber || "",
            vehicleType: res.data.user.vehicleType || "",
            companyName: res.data.user.companyName || "",
            requirements: res.data.user.requirements || "",
          });
          setPreview(res.data.user.profilePic || null);
        })
        .catch((err) => {
          console.error("fetch me error", err);
        });
    }
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // append all possible fields (backend will pick allowed ones)
      Object.keys(form).forEach((k) => {
        if (form[k] !== undefined && form[k] !== null) {
          fd.append(k, form[k]);
        }
      });

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await API.put("/auth/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // update localStorage user and UI
      const updatedUser = res.data.user;
      localStorage.setItem("dc_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPreview(updatedUser.profilePic || preview);
      alert("Profile updated");
    } catch (err) {
      console.error("update profile error", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
  }

  const isDriver = user.role === "driver";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div variants={staggerContainer} initial="hidden" animate="show">
        <motion.h2 variants={fadeIn(0)} className="text-2xl font-bold mb-4">
          My Profile
        </motion.h2>

        <motion.form
          variants={fadeIn(0.1)}
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Left — avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-36 h-36 rounded-full overflow-hidden border border-gray-300">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600">
                  No Photo
                </div>
              )}
            </div>

            <label className="cursor-pointer inline-block mt-2 text-sm px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-900">
              <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
              Change Photo
            </label>

            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setPreview(user.profilePic || null);
              }}
              className="text-xs text-gray-600 mt-1"
            >
              Reset
            </button>
          </div>

          {/* Right — fields */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="input-box w-full"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Email</label>
              <input value={user.email} disabled className="input-box w-full bg-white" />
            </div>

            <div>
              <label className="text-xs text-gray-600">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="input-box w-full" />
            </div>

            <div>
              <label className="text-xs text-gray-600">City</label>
              <input name="city" value={form.city} onChange={onChange} className="input-box w-full" />
            </div>

            {/* Driver-only */}
            {isDriver && (
              <>
                <div>
                  <label className="text-xs text-gray-600">Experience (years)</label>
                  <input name="experience" type="number" value={form.experience} onChange={onChange} className="input-box w-full" />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Vehicle Type</label>
                  <input name="vehicleType" value={form.vehicleType} onChange={onChange} className="input-box w-full" />
                </div>

                <div>
                  <label className="text-xs text-gray-600">License Number</label>
                  <input name="licenseNumber" value={form.licenseNumber} onChange={onChange} className="input-box w-full" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-600">Short Bio</label>
                  <textarea name="bio" rows={3} value={form.bio} onChange={onChange} className="input-box w-full" />
                </div>
              </>
            )}

            {/* Recruiter-only */}
            {!isDriver && (
              <>
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-600">Company Name</label>
                  <input name="companyName" value={form.companyName} onChange={onChange} className="input-box w-full" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-600">Requirements / About Company</label>
                  <textarea name="requirements" rows={3} value={form.requirements} onChange={onChange} className="input-box w-full" />
                </div>
              </>
            )}
          </div>

          {/* Actions full width */}
          <div className="md:col-span-3 mt-1 flex gap-3 justify-end">
            <button type="submit" disabled={loading} className="bg-gray-600 px-4 py-2 rounded-full text-white font-semibold">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
