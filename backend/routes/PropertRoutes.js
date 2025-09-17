import express from "express";
import { CreateProperty, GetmyProperty, updateprperty } from "../controllers/propertyControls.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/Upload.js";

const PropertyRouter = express.Router();

PropertyRouter.post("/property", protect, upload.single("image"), CreateProperty);
PropertyRouter.get("/property", protect, GetmyProperty);

PropertyRouter.put('/property/:id',protect,updateprperty)


export default PropertyRouter;
