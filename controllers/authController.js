/*
The below code is adapted from 
The University of Melbourne - INFO30005 Workshop 4 
'mylibraryapp' by Ronal Singh and Steven Tang  
&
MIT - CRUD Operations with Mongoose and MongoDB Atlas
'gator diner' by Joshua Hall
&
'dev.to" - Authentication in NodeJS With Express and Mongo - CodeLab #1
'authentication api' by Deepak Kumar
*/

// Provide the controller a link to the user model
const user = require("../models/user");
// For token generating, authentication and password hashing
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to login an existing user
const loginUser = async (req, res) => {
  try {
    // Find user by email in the db
    const currUser = await user.findOne({ email: req.body.email });
    if (!currUser)
      return res.status(400).json({
        message: "User email not found.",
      });

    // Compare entered password with password in the db
    const correctPassword = await bcrypt.compare(
      req.body.password,
      currUser.password
    );
    if (!correctPassword)
      return res.status(400).json({
        message: "Incorrect password.",
      });

    // Create payload
    const payload = { user: { id: currUser._id } };
    console.log(payload);

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(currUser));
    delete returnUser.password;

    // Sign in
    jwt.sign(
      payload,
      process.env.SIGN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Login successful.",
          token: token,
          user: returnUser,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to modify user by ID
const updatePassword = async (req, res) => {
  try {
    // Store hashed password
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const updatedUser = await user.findOneAndUpdate(
      { _id: req.user.id },
      { password: newPassword },
      { new: true, useFindAndModify: false }
    );

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(updatedUser));
    delete returnUser.password;

    res.status(200).json({
      message: "Successfully updated user's password.",
      user: returnUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export callbacks
module.exports = {
  updatePassword,
  loginUser,
};
