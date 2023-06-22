// const express=require("express")
// const mongoose =require("mongoose")
// const route=require("./router/route")
// const app=express()
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.use("/",route)

// mongoose.connect("mongodb+srv://sourabhamohite2812:wXzbwlWssiEAjJL1@cluster0.m7awpol.mongodb.net/Book_Managment_saurabh_Digambar")
// .then(()=>console.log("MongoDb is Connected"))
// .catch(err=>console.log(err))

// app.listen(8000,()=>console.log("server is listing on port 8000"))

const express = require('express')
const mongoose = require('mongoose')
const app= express()
const route = require('./router/route')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb+srv://sourabhamohite2812:wXzbwlWssiEAjJL1@cluster0.m7awpol.mongodb.net/shubham-22' ,{useNewUrlParser: true})
.then(()=> console.log("MongoDb is connected"))
.catch((err)=> console.log(err.message))

app.use('/' , route)

app.listen(process.env.PORT || 3000 , function(){
    console.log('Express app running on PORT ', process.env.PORT || 3000 )
})