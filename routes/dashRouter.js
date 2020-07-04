const express = require("express");
// Add our dashboard router
const dashRouter = express.Router();
// Require the dashboard controller
const dashController = require("../controllers/dashController.js");
// For token authentication
const auth = require("../middleware/auth");

dashRouter
  .route("/")
  .post(auth, dashController.getDash);

// Invalid route
dashRouter.all("*", function (req, res) {
  throw new Error(res);
});

// Export the router
module.exports = dashRouter;
