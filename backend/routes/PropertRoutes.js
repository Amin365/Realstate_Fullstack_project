import express from "express";
import { CreateProperty, DeleteProperty, GetAllProperties, GetmyProperty, GetPropertyById, updateProperty } from "../controllers/propertyControls.js";
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
PropertyRouter.delete("/property/:id", protect, DeleteProperty)


export default PropertyRouter;
