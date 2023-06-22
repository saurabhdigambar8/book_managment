const userModel=require("../models/userModel")
const jwt=require("jsonwebtoken")


//create USer ------------------------------------
const createUser=async function(req,res){
  try{   const data=req.body
         const userCreated = await userModel.create(data)
         return res.status(201).send({status:true,data:userCreated})
  }catch(err){
    if(err.message.includes("is required")){
        return res.status(400).send({status:false,message:err.message})
    }
    else if(err.message.includes("validation")){
        return res.status(400).send({status:false,message:err.message})
    }
    else return res.status(500).send({status:false,message:err.message})
  }
}

//Login Apis  -----------------------------------
const userLogin=async function(req, res) {
   try{
    const {email,password}=req.body
    if(!email){
        return res.status(400).send({status:false,message:"Please enter email"})
    }
    if(!password){
        return res.status(400).send({status:false,message:"Please enter password"})
    }
    let login=await userModel.findOne({email,password})
    if(!login){
        return res.status(400).send({status:false, message:"email or password incorrect"})
    }
    
    const createToken=await jwt.sign({userId:login._id},"project4SecreteKey")
    return res.status(201).send({status:true,data:{token:createToken}})

   }catch(err){
    return res.status(500).send({status:false, message:err.message})
   }

}

//exporting -------------------
module.exports = {createUser,userLogin}