const express = require("express")
const mongoose = require("mongoose")
const route = require("./router/route")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", route)
// require("dotenv").config()
// const {mongoString}=process.env
mongoose.connect("mongodb+srv://saurabhdigambar8:X1UED3V4eKh2u9M4@cluster0.tlt0rzr.mongodb.net/Book_Managment", { useNewUrlParser: true })
    // mongoose.connect("mongodb://localhost:27017/book_management")
    .then(() => console.log("MongoDb is Connected"))  
    .catch(err => console.log(err))

app.listen(8000, () => console.log("server is listing on port 8000"))




