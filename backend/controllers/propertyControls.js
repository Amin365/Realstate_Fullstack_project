


import property from "../models/property.js";


// CREATE PROPERTY
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
      image: req.file ? req.file.filename : null,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, property: newProperty });
  } catch (error) {
    next(error);
  }
};

// GET MY PROPERTIES
export const GetmyProperty = async (req, res, next) => {
  try {
    const properties = await property.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};


// public Geters 
// GET /api/properties
export const GetAllProperties = async (req, res, next) => {
  try {
    // Fetch latest 4 properties
    const properties = await property
      .find()
      .sort({ createdAt: -1 })
     

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const GetPropertyById = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const foundProperty = await property.findById(propertyId);
    if (!foundProperty) return res.status(404).json({ success: false, message: "Property not found" });
    res.status(200).json(foundProperty);
  } catch (error) {
    next(error);
  }
}

// UPDATE PROPERTY
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
    };

    if (req.file) updateData.image = req.file.filename;

    const updatedProperty = await property.findByIdAndUpdate(propertyId, updateData, { new: true });
    if (!updatedProperty) return res.status(404).json({ success: false, message: "Property not found" });

    res.json({ success: true, property: updatedProperty });
  } catch (err) {
    next(err);
  }
};
