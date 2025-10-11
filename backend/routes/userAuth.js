import express from "express";
import multer from "multer";

import { protect } from "../middleware/auth.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utility/cloudinary.js";
import { ChangePassword, Createuser, DeleteAccount, GetProfile, Login, UpdateProfile } from "../controllers/AuthControls.js";
import { validate } from "../middleware/ValidateZod.js";
import { CreateUserSChema } from "../schema/userSchema.js";

const Authrouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile", 
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });


// ✅ ROUTES
Authrouter.post("/auth/register", validate(CreateUserSChema), upload.single("profile"), Createuser);
Authrouter.post("/auth/login", Login);
Authrouter.get("/auth/me", protect, GetProfile);
Authrouter.put("/auth/profile", protect, upload.single("profile"), UpdateProfile);
Authrouter.put("/auth/change-password", protect, ChangePassword);
Authrouter.delete("/auth/delete", protect, DeleteAccount);

export default Authrouter;
