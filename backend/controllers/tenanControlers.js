import tenant from "../models/tenant";


export const createTenant = async (req, res, next) =>{
    try {
        const newtanant=await tenant.create({
            ...req.body,
            createdBy:req.user._id



        })
        
    } catch (error) {
        next(error)
        
    }
}       


export const getTenants=async(req,res,next)=>{
    try {
        const tenants= await tenant.find({createdBy:req.user._id}).sort({createdAt:-1})
        res.status(200).json(tenants)
        
    } catch (error) {
        next(error)
        
    }
}

// update


export async function deleteTenant(req, res, next) {
    try{
        const tenantId = req.params.id;
        const deletedTenant = await tenant.findByIdAndDelete(tenantId);
        if (!deletedTenant) {  
            res.status(404).json({ success: false, message: "Tenant not found" });
          } else {
            res.status(200).json({ success: true, message: "Tenant deleted successfully" }); 
        }
    }
    catch(error){
        next(error)
    }

}
