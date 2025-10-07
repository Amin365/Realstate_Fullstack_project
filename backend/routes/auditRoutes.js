import express from "express";

import Audit from "../models/audit.js";

const Auditrouter = express.Router();

Auditrouter.get("/audit", async (req, res) => {
  try {
    const logs = await Audit.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


Auditrouter.post("/audit", async (req, res) => {
  try {
    const newLog = new Audit(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default Auditrouter;
