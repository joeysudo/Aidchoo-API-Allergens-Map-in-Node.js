const express = require("express");
// Add our auth router
const authRouter = express.Router();
// Require the auth controller
const authController = require("../controllers/authController.js");
// For token authentication
const auth = require("../middleware/auth");

authRouter
  .route("/password/change")
  .patch(auth, authController.updatePassword);

authRouter
  .route("/login")
  .post(authController.loginUser);

// Invalid route
authRouter.all("*", function (req, res) {
  throw new Error(res);
});

// Export the router
module.exports = authRouter;
