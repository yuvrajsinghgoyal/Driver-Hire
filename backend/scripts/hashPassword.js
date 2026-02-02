#!/usr/bin/env node
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const usage = () => {
  console.log("Usage: node scripts/hashPassword.js <email> <newPassword>");
  process.exit(1);
};

const [,, email, newPassword] = process.argv;
if (!email || !newPassword) usage();

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in .env");
    }

    await mongoose.connect(process.env.MONGO_URI, { dbName: "driving" });
    console.log("Connected to DB");

    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email);
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    user.password = hashed;
    await user.save();

    console.log(`Password updated for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
