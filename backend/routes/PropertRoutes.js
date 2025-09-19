import express from "express";
import { CreateProperty, GetAllProperties, GetmyProperty, updateProperty } from "../controllers/propertyControls.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const PropertyRouter = express.Router();

// ----------------- ENSURE UPLOADS FOLDER EXISTS -----------------
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

// ----------------- CREATE PROPERTY -----------------
PropertyRouter.post("/property", protect, upload.single("image"), CreateProperty);

// ----------------- GET MY PROPERTIES -----------------
PropertyRouter.get("/property", protect, GetmyProperty);

// ----------------- GET ALL PROPERTIES (PUBLIC) -----------------
PropertyRouter.get("/properties", GetAllProperties);

// ----------------- UPDATE PROPERTY -----------------
PropertyRouter.put("/property/:id", protect, upload.single("image"), updateProperty);

// ----------------- DELETE PROPERTY -----------------
PropertyRouter.delete("/property/:id", protect, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    res.json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default PropertyRouter;
