// backend/controllers/authController.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

import cloudinary from "cloudinary";
import streamifier from "streamifier";

// ✅ CORRECT Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// --------------------------------------------------
// GENERATE TOKEN
// --------------------------------------------------
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// --------------------------------------------------
// REGISTER
// --------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      city,
      role,
      password,
      experience,
      licenseNumber,
      vehicleType,
      bio,
      companyName,
      requirements,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      city,
      role,
      password,
      experience: role === "driver" ? experience : undefined,
      licenseNumber: role === "driver" ? licenseNumber : undefined,
      vehicleType: role === "driver" ? vehicleType : undefined,
      bio: role === "driver" ? bio : undefined,
      companyName: role === "recruiter" ? companyName : undefined,
      requirements: role === "recruiter" ? requirements : undefined,
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    // Return the actual error message to help debugging (temporary)
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// --------------------------------------------------
// LOGIN
// --------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ IMPORTANT FIX
    const user = await User.findOne({ email });

    // Temporary debug logging to diagnose login failures
    console.debug("Login attempt:", { email, role, found: !!user });
    if (user) console.debug("Stored user:", { id: user._id.toString(), storedRole: user.role });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Role mismatch" });
    }

    const isMatch = await user.matchPassword(password);
    console.debug("Password match result for", email, "=>", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




// --------------------------------------------------
// GET LOGGED-IN USER
// --------------------------------------------------
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// --------------------------------------------------
// ✅ UPDATE PROFILE + IMAGE UPLOAD (FIXED)
// --------------------------------------------------
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const userId = req.user._id;

    const allowedFields = [
      "name",
      "phone",
      "city",
      "bio",
      "experience",
      "licenseNumber",
      "vehicleType",
      "companyName",
      "requirements",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] =
          field === "experience" ? Number(req.body[field]) : req.body[field];
      }
    });

    // ✅ IMAGE UPLOAD (CORRECT)
    if (req.file && req.file.buffer) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "driveconnect/profiles" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(req.file.buffer);
      });

      updates.profilePic = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message });
  }
};
