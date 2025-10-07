import property from "../models/property.js";

// ----------------- CREATE PROPERTY -----------------
export const CreateProperty = async (req, res, next) => {
  try {
    const newProperty = await property.create({
      title: req.body.title,
      propertyType: req.body.propertyType,
      status: req.body.status,
      isFavorite: req.body.isFavorite === "true" || req.body.isFavorite === true,
      amount: req.body.amount,
      period: req.body.period,
      currency: req.body.currency,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      areaLength: req.body.areaLength,
      areaWidth: req.body.areaWidth,
      areaUnit: req.body.areaUnit,
      // Cloudinary gives us a hosted URL in req.file.path
      image: req.file ? req.file.path : null,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, property: newProperty });
  } catch (error) {
    next(error);
  }
};

// ----------------- GET MY PROPERTIES -----------------
export const GetmyProperty = async (req, res, next) => {
  try {
    const properties = await property.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// ----------------- GET ALL PROPERTIES (PUBLIC) -----------------
export const GetAllProperties = async (req, res, next) => {
  try {
    const properties = await property.find().sort({ createdAt: -1 })
    
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// ----------------- GET PROPERTY BY ID -----------------
export const GetPropertyById = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const foundProperty = await property.findById(propertyId)
    

    if (!foundProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json(foundProperty);
  } catch (error) {
    next(error);
  }
};

// ----------------- UPDATE PROPERTY -----------------
export const updateProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;

    const updateData = {
      title: req.body.title,
      propertyType: req.body.propertyType,
      status: req.body.status,
      isFavorite: req.body.isFavorite === "true" || req.body.isFavorite === true,
      amount: req.body.amount,
      period: req.body.period,
      currency: req.body.currency,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      areaLength: req.body.areaLength,
      areaWidth: req.body.areaWidth,
      areaUnit: req.body.areaUnit,
      paymentStatus:req.body.paymentStatus
    }

    // Update with Cloudinary URL if new image uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProperty = await property.findByIdAndUpdate(propertyId, updateData, { new: true });

    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, property: updatedProperty });
  } catch (err) {
    next(err);
  }
};

 export const DeleteProperty = async(req,res,next)=>{
    try {
        const deleted= await property.findByIdAndDelete({
         _id: req.params.id,
      createdBy: req.user._id,

        })
        if(!deleted) return res.status(404).json({mesage:"Property Not Found"})
             res.status(200).json({ success: true, message: "Deleted successfully" });
        
    } catch (error) {
        next(error)
    }
}

