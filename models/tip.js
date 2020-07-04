//Set-up mongoose.
const mongoose = require("mongoose");
//To silence depcraction warnings
mongoose.set("useCreateIndex", true);

//Create a new schema for tips
const Schema = mongoose.Schema;
const tipSchema = new Schema({
  allergen: {
    type: String,
    required: [true, "Please specify the allergen"],
  },
  index: {
    type: Number,
    required: [true, "Please specify the index"],
  },
  severity: {
    type: String,
    required: [true, "Please specify the severity"],
  },
  message: {
    type: String,
    required: [true, "Please enter the tip message"],
  },
});

//Create model from the tip schema
const tips = mongoose.model("tip", tipSchema, "tip");

module.exports = tips;
