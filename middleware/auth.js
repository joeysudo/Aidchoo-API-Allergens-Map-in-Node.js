/*
The below code is adapted from 
'dev.to" - Authentication in NodeJS With Express and Mongo - CodeLab #1
'authentication api' by Deepak Kumar
*/

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Authentication Error." });

  try {
    const decoded = jwt.verify(token, process.env.SIGN_SECRET);
    req.user = decoded.user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
