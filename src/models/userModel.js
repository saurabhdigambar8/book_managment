const mongoose = require('mongoose')
const valid=require("validator")
const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "titile is required"],
      enum: {
        values: ["Mr", "Mrs", "Miss"],
        message: "title must be in Mr or Mrs or Miss"
      },
      trim: true
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      validate: {
        validator: async function(value) {
          const count = await this.model('user').countDocuments({ phone: value });
          return count === 0;
        },
        message: 'this phone is already register'
      },
      trim: true
    },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          // Use the library's email validation method
          return valid.isEmail(value);
        },
        message: 'Invalid email address'
      },
      required: [true, "email is required"],
      validate: { // for uniqueness
        validator: async function(value) {
          const count = await this.model('user').countDocuments({ email: value });
          return count === 0;
        },
        message: 'this email is already register'
      },
      trim: true
    },
    password: {
      type: String,
      required: [true, "password is  requird"],
      minLength: [8, "PAssword must contains atleast 8 character"],
      maxLength: [15, "password is not more than 15 character"],
      trim: true
    },
    address: {
      street: { type: String },
      city: { type: String },
      pincode: { type: String }
    },
   
  },
  {timestamps: true }
)
module.exports = mongoose.model("user", userSchema)  