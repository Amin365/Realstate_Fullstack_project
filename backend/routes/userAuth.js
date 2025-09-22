

import express from "express";
import { Createuser,Login } from "../controllers/AuthControls.js";
import { validate } from "../middleware/ValidateZod.js";
import { CreateUserSChema } from "../schema/userSchema.js";
import { protect } from "../middleware/auth.js";
import fs from "fs";
import multer from "multer";
import path from "path";
import User from "../models/user.js";
const Authrouter = express.Router();

const uploadDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ----------------- MULTER CONFIG -----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // save inside backend/uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Optional: only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

const upload = multer({ storage, fileFilter });


Authrouter.post('/auth/register',validate(CreateUserSChema),upload.single("profile"),Createuser)

Authrouter.post('/auth/login',Login)

Authrouter.get('/auth/me', protect, async (req, res) => {
  
  res.json(req.user);


});


// ✅ UPDATE PROFILE ROUTE
Authrouter.put(
  "/auth/profile",
  protect,
  upload.single("avatar"), // <-- expects "avatar" from frontend
  async (req, res, next) => {
    try {
      const { username } = req.body;
      const updateData = {};

      if (username) updateData.name = username; // update name
      if (req.file) updateData.profile = `/uploads/${req.file.filename}`; // save avatar path

      const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        select: "-password", // exclude password from response
      });

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      next(err);
    }
  }
);
Authrouter.get("/auth/profile", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
});

export default Authrouter;