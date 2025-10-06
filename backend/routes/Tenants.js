
import express from "express";
import { protect } from "../middleware/auth.js";
import { CreateTenants, DeleteTenant, GetAlltenants, UpdateTenant } from "../controllers/tenantsControler.js";

const TenantsRouter = express.Router()


TenantsRouter.post('/tenants',protect,CreateTenants)
TenantsRouter.get('/tenants',protect,GetAlltenants)
TenantsRouter.delete('/tenants/:id',DeleteTenant)
TenantsRouter.put('/tenants/:id',UpdateTenant)

export default TenantsRouter