/*
The following code is adapted from
University of Melbourne - Tutorial 5 INFO30005
'my library app' by Ronal Singh, Steven Tang, Ziad Albkhetan, and Alex Wu
*/

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
const CONNECTION_STRING =
  "mongodb+srv://<user>:<password>@aidchoo2-1r981.mongodb.net/test?retryWrites=true&w=majority";
const MONGO_URL = CONNECTION_STRING.replace("<password>", process.env.MONGO_PASSWORD);
const MONGO_URL_USER = MONGO_URL.replace("<user>", process.env.MONGO_USER);

mongoose.connect(MONGO_URL_USER || "mongodb://localhost/info30005", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "aidchoo",
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port);
});

require("../models/user");
