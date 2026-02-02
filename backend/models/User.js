// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    city: { type: String },
    role: {
      type: String,
      enum: ["driver", "recruiter"],
      required: true,
    },
    // Driver fields
    experience: { type: Number },
    licenseNumber: { type: String },
    vehicleType: { type: String },
    bio: { type: String },

    // Recruiter fields
    companyName: { type: String },
    requirements: { type: String },

    profilePic: { type: String }, // <-- new field: URL of cloudinary image


    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
  // If password wasn't modified, nothing to do (use promise-style hook)
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
