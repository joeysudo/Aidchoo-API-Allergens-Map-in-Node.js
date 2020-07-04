const express = require("express");
// Add our user router
const userRouter = express.Router();
// Require the user controller
const userController = require("../controllers/userController.js");
// For token authentication
const auth = require("../middleware/auth");

userRouter
  .route("/id/:id")
  .get(userController.getUserByID);

userRouter
  .route("/email/:email")
  .get(userController.getUserByEmail);

userRouter
  .route("/profile")
  .get(auth, userController.getProfile)
  .patch(auth, userController.updateUser)
  .delete(auth, userController.deleteUser);

userRouter
  .route("/register")
  .post(userController.addUser);

//Invalid route
userRouter.all("*", function (req, res) {
  throw new Error(res);
});

// Export the router
module.exports = userRouter;
