import express from "express";
import { CreateProperty, GetmyProperty, updateProperty } from "../controllers/propertyControls.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const PropertyRouter = express.Router();

// ----------------- MULTER CONFIG -----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ----------------- CREATE PROPERTY -----------------
PropertyRouter.post("/property", protect, upload.single("image"), CreateProperty);

// ----------------- GET MY PROPERTIES -----------------
PropertyRouter.get("/property", protect, GetmyProperty);

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
