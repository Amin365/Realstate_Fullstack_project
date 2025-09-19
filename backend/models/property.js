import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    amount: {
      type: Number,
   
    },
    period: {
      type: String,
      enum: ["month", "year"],
      default: "month",
    },
    currency: {
      type: String,
      default: "BIRR",
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Land", "Office"],
    },
    status: {
      type: String,
      enum: ["For Sale", "For Rent"],
      default: "For Sale",
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    unit: {
      type: String,
      default: "m²",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const property = mongoose.model("property", PropertySchema);
export default property;
