const  sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        stack:err.stack,
        error:err,
      })
}
const sendErrorProd=(err,res)=>{
    if(err.isOprational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
          })
    }else{
        //log the error to the console 
        console.log('Error',err)
          res.status(500).json({status:'error',
           message:'something went very wrong'})
    }
    
}

module.exports=(err,req,res,next)=>{
    // console.log(err.stack)
    err.statusCode=err.statusCode||500
    err.status=err.status||'error'
    if(process.env.NODE_ENV=='devlopment'){
        sendErrorDev(err,res)

    }else if(process.env.NODE_ENV=='production'){
        sendErrorProd(err,res)
    }
  }