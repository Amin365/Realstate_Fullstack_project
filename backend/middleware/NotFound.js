
export const NotFound =(req,res,next)=>{
    const error=new Error(`rout of ${req.originalUrl} not Found`)

    next(error)
} 