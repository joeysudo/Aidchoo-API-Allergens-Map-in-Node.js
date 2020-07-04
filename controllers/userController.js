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
// For token generating and authentication
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Function to search users by ID
const getUserByID = async (req, res) => {
  try {
    const foundUser = await user.findById(req.params.id);

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(foundUser));
    delete returnUser.password;

    res.status(200).json({ user: returnUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Function to search users by email
const getUserByEmail = async (req, res) => {
  try {
    const foundUser = await user.findOne({ email: req.params.email });

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(foundUser));
    delete returnUser.password;

    res.status(200).json({ user: returnUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to create user and save it to the db
const addUser = async (req, res) => {
  try {
    // Check if email already exists
    if (req.body.email) {
      let emailExists = await user.findOne({ email: req.body.email });
      if (emailExists)
        return res.status(400).json({
          message: "That email is already taken.",
        });
    }

    // Create new document instance based on request body
    // Mongoose schema will validate the rest for us
    const newUser = new user(req.body);

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    // Attempt to save user to db
    await newUser.save();

    // Create payload
    const payload = { user: { id: newUser._id } };
    console.log(payload);

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(newUser));
    delete returnUser.password;

    // Sign in
    jwt.sign(
      payload,
      process.env.SIGN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: "Registered new user.",
          token: token,
          user: returnUser,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function that displays user record if they are logged in
const getProfile = async (req, res) => {
  try {
    // FoundUser will return after token authentication middleware runs
    const foundUser = await user.findById(req.user.id);

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(foundUser));
    delete returnUser.password;

    res.status(200).json({
      user: returnUser,
      token: req.token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to modify user by ID
const updateUser = async (req, res) => {
  try {
    // Check if email that is going to be updated already exists
    if (req.body.email) {
      let emailExists = await user.findOne({ email: req.body.email });
      if (emailExists)
        return res.status(400).json({
          message: "That email is already taken.",
        });
    }

    // Please use function in the auth controller to update password
    if (req.body.password) {
      return res.status(400).json({
        message: "Please use password change route to update passwords.",
      });
    }

    const updatedUser = await user.findOneAndUpdate(
      { _id: req.user.id },
      req.body,
      { new: true, useFindAndModify: false }
    );

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(updatedUser));
    delete returnUser.password;

    res.status(200).json({
      message: "Successfully updated user.",
      user: returnUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to delete user by id
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.user.id, {
      useFindAndModify: false,
    });

    // Do not return user's password in JSON!
    const returnUser = JSON.parse(JSON.stringify(deletedUser));
    delete returnUser.password;

    res.status(200).json({
      message: "Successfully deleted user.",
      user: returnUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export callbacks
module.exports = {
  getUserByID,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  getProfile,
};
