//Set-up mongoose.
const mongoose = require("mongoose");
//To silence deprecation warnings
mongoose.set("useCreateIndex", true);

//Create a new schema for trees
const Schema = mongoose.Schema;
const treeSchema = new Schema({
  commonName: {
    type: String,
    required: [true, "Please add a commonName"],
  },
  latitude: {
    type: Number,
    required: [true, "Please add a latitude"],
  },
  longtitude: {
    type: Number,
    required: [true, "Please add a latitude"],
  },
  season: {
    type: String,
    enum: ["Spring", "Summer", "All year"],
    required: [true, "Please add a flowering season"],
  },
});

//Create model from the treee schema
const trees = mongoose.model("tree", treeSchema, "tree");

module.exports = trees;
