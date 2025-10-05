import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    amount: {
      type: Number,
      required: true, // always required
      min: 0,
    },
    period: {
      type: String,
      enum: ["month", "year"],
      default: "month",
      required: function () {
        return this.status === "For Rent"; // only required when renting
      },
    },
    currency: {
      type: String,
      default: "BIRR",
      uppercase: true,
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Land", "Office"],
      required: true,
    },
  status: {
  type: String,
  enum: ["available", "rented"],
  default: "available",
},

    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    length: {
      type: Number,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
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
