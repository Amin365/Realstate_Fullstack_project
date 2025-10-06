import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
  
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "rented","available"],
      default: "pending",
    },
    tenantsPayments:{
  type:String,
  enum:["pending","paid"],
  default:"pending"
},
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const tenants = mongoose.model("tenants", tenantSchema);

export default tenants;
