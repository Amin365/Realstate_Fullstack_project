// models/audit.js
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    tenant: { type: String, required: true },
    action: { type: String, required: true },
    date: { type: Date, default: Date.now },
    performedBy: { type: String, default: "admin" }, 
  },
  { timestamps: true }
);




const Audit = mongoose.model("Audit", auditSchema);
export default Audit;