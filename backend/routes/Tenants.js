
import express from "express";
import { protect } from "../middleware/auth.js";
import { CreateTenants, GetAlltenants } from "../controllers/tenantsControler.js";

const TenantsRouter = express.Router()


TenantsRouter.post('/tenants',protect,CreateTenants)
TenantsRouter.get('/tenants',protect,GetAlltenants)


export default TenantsRouter