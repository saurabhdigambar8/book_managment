const aws=require('aws-sdk')
const { request } = require('express')

aws.config.update({
    accessKeyId: 'AKIAY3L35MCRZNIRGT6N',
    secreteAccessKeyId:'9f+YFBVcSjZWM6DG9R4TUN8k8TGe4X+lXmO4jPiU',
    region:"ap-south-1"
})

const uplodFile= async function(file){
    return new Promise((resolve, reject) =>{
   const s3= new aws.S3({apiVersion:"2006-03-01"})
   var uplodParams={
    ACL:"public-read",
    Bucket:"classroom-training-bucket",
    key:"abc/"+file.originalname,
    body:file.buffer
   }
   s3.upload(uplodParams,function(err,data){
    if(err){
        return reject({"error":err})
    }
    return resolve(data.location)
   })
})
}

async function createLink(req, res, next) {
    try{
        const file=req.files
        console.log(file)
    if(file&&file.length>0){
        console.log("uploding");
        let upldodedFileUrl=await uplodFile(file[0])  
        console.log(upldodedFileUrl)
        req.bookCover=upldodedFileUrl 
        next()
    }else{
        res.status(500).send({status:false,message:"bookCover is missing"}) 
    }
    }catch(err){
        console.log("aws")
        return res.status(500).send({status:false,message:err.message})
    }
}
module.exports={createLink}