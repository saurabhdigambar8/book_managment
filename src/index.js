const express=require("express")
const mongoose =require("mongoose")
const route=require("./router/route")
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/",route)

mongoose.connect("mongodb+srv://saurabhdigambar:saurabh12345@cluster0.ht4lll8.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true})
// mongoose.connect("mongodb://localhost:27017/book_management")
.then(()=>console.log("MongoDb is Connected"))
.catch(err=>console.log(err))

app.listen(8000,()=>console.log("server is listing on port 8000"))
