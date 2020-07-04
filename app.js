/*
The below code is adapted from 
The University of Melbourne - INFO30005 Workshop 4 
'mylibraryapp' by Ronal Singh and Steven Tang.
*/

const express = require("express");
const bodyParser = require("body-parser");
const mainRouter = require("./routes/mainRouter");
const cors = require("cors");

// To connect to the Database
require("./config/db");

const app = express();

// To help our front end connect with back end.
app.use(cors());

// Body-parser middleware, which parses request bodies into req.body
// Support parsing of JSON
app.use(bodyParser.json());

// Support parsing of urlencoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routers
app.use("/api", mainRouter);

// GET request for the home page
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Aidchoo's backend.");
});

// Handle invalid routes
app.all("*", function (req, res) {
  throw new Error(res);
});

// Error handling. Defines behaviour for invalid routes and bad requests
app.use(function (err, req, res, next) {
  if (err.statusCode === 400) {
    res.status(400).json({
      error: "Bad request. Check formatting.",
    });
    return;
  }

  res.status(404).json({
    error: "Application Error. Route not found.",
  });
});

// Listen for requests on the local host
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log("The Aidchoo backend is listening on port" + port);
});

module.exports = app;
