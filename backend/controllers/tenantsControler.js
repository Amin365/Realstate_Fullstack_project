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
      tenantsPayments:"pending",
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
    const alltenant = await Tenants.find({ createdBy: req.user._id })
      .populate("propertyId", "title address status createdAt period amount currency paymentStatus image"); 

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


// export const UpdateTenant = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { fullName, email, phone, message, status, tenantsPayments } = req.body;

//     // Find the tenant
//     const tenant = await Tenants.findById(id);
//     if (!tenant) {
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // Update tenant details
//     tenant.fullName = fullName || tenant.fullName;
//     tenant.email = email || tenant.email;
//     tenant.phone = phone || tenant.phone;
//     tenant.message = message || tenant.message;
//     tenant.status = status || tenant.status;
//     tenant.tenantsPayments = tenantsPayments || tenant.tenantsPayments;

//     await tenant.save();

//     //  If status changed, sync property status
//     if (status) {
//       await Property.findByIdAndUpdate(tenant.propertyId, { status });
//     }

//     //  If tenant payment changed, update property payment status
//     if (tenantsPayments) {
//       await Property.findByIdAndUpdate(tenant.propertyId, {
//         paymentStatus: tenantsPayments,
//       });

//       // ✅ EXTRA LOGIC: if payment is paid → set property rented
//       if (tenantsPayments === "paid") {
//         await Property.findByIdAndUpdate(tenant.propertyId, { status: "rented" });
//       }
//     }

//     res.json({ message: "Tenant updated successfully", tenant });
//   } catch (error) {
//     next(error);
//   }
// };
export const UpdateTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, message, status, tenantsPayments } = req.body;

    // 1️⃣ Find tenant
    const tenant = await Tenants.findById(id);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // 2️⃣ Find related property
    const property = await Property.findById(tenant.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 3️⃣ Update basic info
    tenant.fullName = fullName || tenant.fullName;
    tenant.email = email || tenant.email;
    tenant.phone = phone || tenant.phone;
    tenant.message = message || tenant.message;

    // 4️ Handle payment sync logic
    if (tenantsPayments) {
      tenant.tenantsPayments = tenantsPayments;
      property.paymentStatus = tenantsPayments;

      //  If payment = paid → both rented
      if (tenantsPayments === "paid") {
        tenant.status = "rented";
        property.status = "rented";
      }

      //  If payment = pending → both available
      else if (tenantsPayments === "pending") {
        tenant.status = "available";
        property.status = "available";
      }
    }

    // 5️ Handle manual status change (optional override)
    if (status) {
      tenant.status = status;
      property.status = status;
    }

    // 6️ Save updates
    await tenant.save();
    await property.save();

    res.json({
      message: "Tenant and Property updated successfully",
      tenant,
      property,
    });
  } catch (error) {
    next(error);
  }
};

