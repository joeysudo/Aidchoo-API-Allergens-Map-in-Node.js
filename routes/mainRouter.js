const express = require("express");
// Add our main router
const mainRouter = express.Router();

// Require all of the routers
const treeRouter = require("./treeRouter");
const dashRouter = require("./dashRouter");
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");

// Use all of the routers
mainRouter.use("/user", userRouter);
mainRouter.use("/map/trees", treeRouter);
mainRouter.use("/dashboard", dashRouter);
mainRouter.use("/auth", authRouter);

module.exports = mainRouter;
