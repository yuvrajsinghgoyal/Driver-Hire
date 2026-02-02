
import express from "express";
import multer from "multer";



import {
  registerUser,
  loginUser,
  getMe,
  updateProfile
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// multer memory storage
// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);


router.put(
  "/profile",
  protect,
  upload.single("image"),
  updateProfile
);

export default router;
