const bookModel = require("../models/bookModel.js");
const reviewModel=require("../models/reviewModel.js");

const createReview=async function(req, res){
    try {
         const data=req.body
         data.reviewedAt=Date.now()// for adding current date and time to review
         const bookId=req.params.bookId
         data.bookId=bookId //set bookid in data for storing bookId in reviewcollection
         const getBook=await bookModel.findOne({_id:bookId,isDeleted:false})
         if(!getBook){
        return res.status(404).send({status:false, message:"Book not found by this id"})
         }
         const reviewCreated=await reviewModel.create(data);
         const reviewsCountUpdateInBook=await bookModel.findByIdAndUpdate(bookId, {$inc:{reviews:1}},{new:true}).lean()
         const saveData={...reviewsCountUpdateInBook,reviewsData:reviewCreated} //doubt
         return res.status(201).send({status:true, data:saveData});
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
//------Update Review--------------------

const updateReview=async function(req,res){ //confusion how get get multiple revieew data array 
    try{
        const bookId=req.params.bookId
        const reviewId=req.params.reviewId
        const data=req.body
        if(typeof data.rating !="number"){
            return res.status(400).send({status : false, message : "rating should be  a number" })
         }
        if(data.rating<1||data.rating>5){
          return res.status(400).send({status:false,message:"Invalid rating format"})
        }
        if(!data.review|| (typeof data.review!="string"||data.review.trim().length==0)){
            return res.status(400).send({status:false,message:"Invalid review"})
        }
        if(data.reviewedBy&& (typeof data.reviewedBy!="string"||data.reviewedBy.trim().length==0)){
            return res.status(400).send({status:false,message:"Invalid reviewers name"})
        }
        const getBook=await bookModel.findOne({_id:bookId,isDeleted:false})
         if(!getBook){
        return res.status(404).send({status:false, message:"Book not found by this id"})
         }
         const getReview=await reviewModel.find({_id:reviewId,isDeleted:false})
         if(!getReview){
            return res.status(404).send({status:false, message:"Review not found by this id"})
        }
        const sendData={...getBook,reviewsData:getReview} //doubt in responce structure
        return res.status(200).send({status:true,data:sendData})
    
    }catch(err){
        return res.status(500).send({status:false,message:err.message});
    }
}
//----deleteReviews------------------------
const deleteReviews=async function(req,res){
    try{
        const bookId=req.params.bookId
        const reviewId=req.params.reviewId
       
        const getBook=await bookModel.findOne({_id:bookId,isDeleted:false})
         if(!getBook){
        return res.status(404).send({status:false, message:"Book not found by this id"})
         }
         const getReview=await reviewModel.find({_id:reviewId,isDeleted:false})
         if(!getReview){
            return res.status(404).send({status:false, message:"Review not found by this id"})
        }
        const deleteReview=await reviewModel.findByIdAndUpdate(reviewId,{isDeleted:true})
        const reviewPdateInBook=await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:-1}})
        return res.status(200).send({status:true, message:"Book deleted successfully"})
    }catch(err){
        return res.status(500).send({status:false,message:err.message});
    }
}

module.exports ={createReview,updateReview,deleteReviews}

