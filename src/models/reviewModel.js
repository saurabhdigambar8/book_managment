const mongoose = require('mongoose')
const reviewSchema =new  mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    require: [true, "bookId is required"],
    ref: "Book",
    trim: true
  },
  reviewedBy: {
    type: String,
    required: [true, "reviewedBy is required"],
    default: 'Guest',
    trim: true
  },
  reviewedAt: {
    type:Date,
    required: [true, "reviewedAt is required"],
    trim: true
  },
  rating: {
    type: Number,
    min: [1, "rating not less than 1"],
    max: [5, "rating not more than 5"],
    required: [true, "rating is required"],
    trim: true
  },
  review: String,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model("review", reviewSchema)