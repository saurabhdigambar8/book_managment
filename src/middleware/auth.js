const jwt=require("jsonwebtoken")
const bookModel=require("../models/bookModel")
const userModel=require("../models/userModel")
const validator=require('validator')

const authentication=async function(req,res,next){
    try{
  const  token = req.headers["x-api-key"]
   if(!token){
    return res.status(401).send({status:false,message:"token is missing"})
   }
   const decodedToken=jwt.verify(token,"project4SecreteKey")
   if (!decodedToken) {
    return res.status(401).send({ status: false, message: "invalid token" })
}
req.decodedToken=decodedToken
req.userId=decodedToken.userId
next()
}catch(err){
    if (err.message.includes("signature") || err.message.includes("token") || err.message.includes("malformed")) {

        // console.log(err.message)
        return res.status(401).send({ status: false, message: "You are not Authenticated" })
    }
    return res.status(500).send({ status: false, message: err.message })
}
}
//--------------------------------
const authorisation =async function(req,res,next){
    try{
        const decodedToken=req.decodedToken
        const bodyData=req.body
       const paramBookId=req.params.bookId
        const getBook = await bookModel.findOne({_id:paramsBookId})

        if(bodyData.userId){
            if(bodyData.userId!=decodedToken.userId){
                return res.status(403).send({ status: false, message:"You are not authorised"})
            }
        }
        if(getBook.userId!=decodedToken.userId){
            return res.status(403).send({ status: false, message:"You are not authorised"})
        }
       next()
        
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports={authentication,authorisation}

