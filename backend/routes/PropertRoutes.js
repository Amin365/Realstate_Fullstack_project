import express from "express";
import { CreateProperty, GetAllProperties, GetmyProperty, GetPropertyById, updateProperty } from "../controllers/propertyControls.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utility/cloudinary.js";


const PropertyRouter = express.Router();

// ----------------- CLOUDINARY STORAGE -----------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "properties", // folder in cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

// ----------------- CREATE PROPERTY -----------------
PropertyRouter.post("/property", protect, upload.single("image"), CreateProperty);

// ----------------- GET MY PROPERTIES -----------------
PropertyRouter.get("/property", protect, GetmyProperty);

// ----------------- GET ALL PROPERTIES (PUBLIC) -----------------
PropertyRouter.get("/properties", GetAllProperties);

PropertyRouter.get("/properties/:id", GetPropertyById);

// ----------------- UPDATE PROPERTY -----------------
PropertyRouter.put("/property/:id", protect, upload.single("image"), updateProperty);

// ----------------- DELETE PROPERTY -----------------
PropertyRouter.delete("/property/:id", protect, async (req, res) => {
  try {
    const property = await property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    res.json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default PropertyRouter;
