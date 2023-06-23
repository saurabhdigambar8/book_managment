const express = require("express")
const Router = express.Router()
const { createUser, userLogin } = require("../controller/userController")
const { createBook, getBooksByFilter, getBookById, updateBook, deleteBook } = require("../controller/bookController")
const { createReview, updateReview, deleteReviews } = require("../controller/reviewController")
const { authentication, authorisation } = require("../middleware/auth")
//---------USer Api
Router.post("/register", createUser)
Router.post("/login", userLogin)
//-----Book Api
Router.post("/books", authentication, authorisation, createBook)
Router.get("/books", authentication, getBooksByFilter)
Router.get("/books/:bookId", authentication, getBookById)
Router.put("/books/:bookId", authentication, authorisation, updateBook)
Router.delete("/books/:bookId", authentication, authorisation, deleteBook)
//-----review Api
Router.post("/books/:bookId/review", authentication, createReview)
Router.put("/books/:bookId/review/:reviewId", authentication, updateReview)
Router.delete("/books/:bookId/review/:reviewId", authentication, deleteReviews)
//universal api
Router.use("*", (req, res) => {
    return res.status(404).send({ status: false, message: "Page not found" })
})
module.exports = Router 