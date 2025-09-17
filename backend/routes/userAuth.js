

import express from "express";
import { Createuser,Login } from "../controllers/AuthControls.js";
import { validate } from "../middleware/ValidateZod.js";
import { CreateUserSChema } from "../schema/userSchema.js";
import { protect } from "../middleware/auth.js";
const Authrouter=express.Router()


Authrouter.post('/auth/register',validate(CreateUserSChema),Createuser)

Authrouter.post('/auth/login',Login)

Authrouter.get('/auth/me', protect, async (req, res) => {
  
  res.json(req.user);
});

export default Authrouter;