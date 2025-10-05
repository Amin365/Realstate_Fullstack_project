import Property from "../models/property.js";
import Tenants from "../models/tenants.js";

export const CreateTenants = async (req, res, next) => {
  try {
    const { propertyId, fullName, email, phone, message } = req.body;

    // ✅ Use uppercase model variable
    const foundProperty = await Property.findById(propertyId);
    if (!foundProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (foundProperty.status === "rented") {
      return res.status(400).json({ message: "This property is already rented" });
    }

    const newTenant = await Tenants.create({
      fullName,
      email,
      phone,
      message,
      propertyId,
      status: "rented",
      createdBy: req.user._id,
    });

    foundProperty.status = "rented"; 
    await foundProperty.save();

    res.status(201).json({ message: "Tenant Created Successfully", newTenant });
  } catch (error) {
    next(error);
  }
};

export const GetAlltenants = async (req, res, next) => {
  try {
    const alltenant = await Tenants.find({ createdBy: req.user._id });
    res.status(200).json({ message: "gets all tenants", alltenant });
  } catch (error) {
    next(error);
  }
};

export const DeleteTenant = async (req, res, next) => {
  try {
    const tenant = await Tenants.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    
    await Property.findByIdAndUpdate(tenant.propertyId, { status: "available" });

    await Tenants.findByIdAndDelete(req.params.id);

    res.json({ message: "Tenant deleted and property set to available" });
  } catch (error) {
    next(error);
  }
};
