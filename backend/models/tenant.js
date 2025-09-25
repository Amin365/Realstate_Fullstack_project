import mongoose from 'mongoose'

const tenantScema =new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },

    phone:{
        type:String,
        required:true,
    
    }
    ,
    email:{
        type:String,
        required:true,
    },
    message:
    {
        type:String,
        required:false,


    }
  


},

  { timestamps: true }

)


const tenant = mongoose.model("tenant", tenantScema);
export default tenant;