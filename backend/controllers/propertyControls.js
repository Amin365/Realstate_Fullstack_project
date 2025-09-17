import property from "../models/property.js";


export const CreateProperty = async (req, res, next) => {
  try {
    

    const newProperty = await property.create({
      ...req.body,
     
      createdBy: req.user._id,
    });

    res.status(201).json(newProperty);
  } catch (error) {
    next(error);
  }
};

export const GetmyProperty =async(req,res,next)=>{
try {
        const properties =await property.find({createdBy:req.user._id}).sort({createdAt:-1})
        res.status(201).json(properties)

    
} catch (error) {
    next(error)
}

}

// update Property


export const updateprperty =async(req,res,next)=>{
    try {
        const pro= await property.findByIdAndUpdate({_id:req.params.id,createdBy: req.user._id},
            req.body,
            {new:true}
        )
          if (!pro) return res.status(404).json({ message: 'Task not found' });
    res.json(pro);
    } catch (error) {
        next(error)
        
    }
}