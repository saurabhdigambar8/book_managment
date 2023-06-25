const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const ObjectId = require("mongoose").Types.ObjectId

//create books
const createBook = async function (req, res) {
    try {
        const data = req.body
        if (!ObjectId.isValid(data.userId)) {
            return res.status(400).send({ status: false, message: "Invalid objectid" })
        }
        const user = await userModel.findById(data.userId)
        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }
        if (req.userId != data.userId) {
            return res.status(403).send({ status: false, message: "Unauthorised user" })
        }
        const isbnCheck = await bookModel.findOne({ ISBN: data.ISBN })
        if (isbnCheck) {
            return res.status(400).send({ status: false, message: "ISBMN must be unique" })
        }
        const book = await bookModel.create(data)
        console.log(book);
        return res.status(201).send({ status: true, data: book })
    } catch (err) {
        if (err.message.includes("is required")) {
            return res.status(400).send({ status: false, message: err.message })
        }
        else if (err.message.includes("validation")) {
            return res.status(400).send({ status: false, message: err.message })
        }
        else return res.status(500).send({ status: false, message: err.message })
    }
}
//getbooks by filter ----------------
const getBooksByFilter = async function (req, res) {
    try {
        const data = req.query
        const { userId, category, subcategory } = data

        const getbooks = await bookModel.find({ $and: [{ isDeleted: false }, data] }).sort({ title: 1 }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, review: 1, releasedAt: 1, })
        if (getbooks.length < 1) {
            return res.status(404).send({ status: false, message: "No book found" })
        }
        return res.status(200).send({ status: true, message: "Book list", data: getbooks })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
//get book by id------------------------------------------
const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "invalid bookId" })
        }
        const books = await bookModel.findById(bookId).lean()
        if (!books || books.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        const review = await reviewModel.find({ bookId: bookId, isDeleted: false })
        const resData = { ...books, reviedBy: review } // doubt 
        return res.status(200).send({ status: true, message: "Book list", data: resData })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
//update book--------------------------------

const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let data = req.body
        let { title, excerpt, releasedAt, ISBN } = data
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "invalid bookId" })
        }
        let titleCheck = await bookModel.findOne({ title: title })
        if (title && (titleCheck || typeof title != "string")) {
            return res.status(400).send({ status: false, message: "this title is already in use please try unique title or title is not valid" })
        }

        let ISBNCheck = await bookModel.findOne({ ISBN: ISBN })
        if (ISBN && (ISBNCheck || typeof ISBN != "string")) {
            return res.status(400).send({ status: false, message: "this ISBN is already in use please try unique ISBN or ISBN is not valid" })
        }

        if (excerpt && typeof excerpt != "string") {
            return res.status(400).send({ status: false, message: "this is not valid excerpt" })
        }
        let releasedAtCheck = /^\d{4}-\d{2}-\d{2}$/.test(releasedAt)
        if (!releasedAtCheck && releasedAt) {
            return res.status(400).send({ status: false, message: "releasedAt is not in valid format" })
        }

        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, data, { new: true })
        if (!updatedBook) {
            return res.status(404).send({ status: false, message: "Books not found" })
        }
        return res.status(200).send({ status: true, message: "Book list", data: updatedBook })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
//Delete Book------------------------------------------------------------------

const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "invalid bookId" })
        }
        const getBook = await bookModel.findOne({ _id: bookId, isDeleted: false })//doubt
        if (!getBook) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        const deletedBook = await bookModel.findByIdAndUpdate(bookId, { isDeleted: true }, { new: true })
        return res.status(200).send({ status: true, message: "successfully deleted" })
   
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//exprting-----------------------------
module.exports = { createBook, getBooksByFilter, getBookById, updateBook, deleteBook }