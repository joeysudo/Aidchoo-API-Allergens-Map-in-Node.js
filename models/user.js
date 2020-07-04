//Set-up mongoose.
const mongoose = require("mongoose");
//To silence depcraction warnings
mongoose.set("useCreateIndex", true);
const uniqueValidator = require("mongoose-unique-validator");

//Create a new schema for users
const Schema = mongoose.Schema;
const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
  firstName: {
    type: String,
    required: [true, "Please add a first name"],
  },
  lastName: String,
  email: {
    type: String,
    required: [true, "Please add an email address"],
    unique: true,
    uniqueCaseInsensitive: true,
  },
  allergens: [
    {
      type: String,
      enum: ["Tree", "Grass", "Weeds", "Pollution"],
    },
  ],
  severity: {
    type: String,
    enum: ["High", "Medium", "Low", "None"],
    required: [true, "Please indicate the hayfever severity"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//Create model from the user schema
userSchema.plugin(uniqueValidator, {
  message: "Error, that {PATH} is already taken.",
});
const users = mongoose.model("user", userSchema, "user");

module.exports = users;
