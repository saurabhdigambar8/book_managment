const mongoose = require('mongoose')
//const validator = require('validator')
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        validate: {  //for uniqueness check
            validator: async function (value) {
                const count = await this.model('user').countDocuments({ title: value });
                return count === 0;
            },
            message: 'Duplicate title found'
        },
        trim: true
    },
    excerpt: {
        type: String,
        required: [true, "excerpt is required"],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "userID is required"],
        ref: "user",
        trim: true
    },
    ISBN: {
        type: String,
        required: [true, "ISBN is required"],
        validate: {  //for uniqueness check
            validator: async function (value) {
                const count = await this.model('user').countDocuments({ ISBN: value });
                return count === 0;
            },
            message: 'Duplicate ISBN found'
        },
        trim: true
    },
    category: {
        type: String,
        required: [true, "catagory is required"],
        trim: true
    },
    subcategory: {
        type: [String],
        require: [true, "subcatagory is required"],
        trim: true
    },
    reviews: {
        type: Number,
        default: 0,
        trim: true
    },
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: String, // if use date then it not validate properly
        required: [true, "releasedAt is required"],
        validate: {
            validator: function (value) {
                let res = /^\d{4}-\d{2}-\d{2}$/.test(value)
                return res
            },
            message: 'Invalid date format must be in  YYYY-MM-DD'
        },
        trim: true
    }
}, { timestamps: true })
module.exports = mongoose.model('Book', bookSchema)

