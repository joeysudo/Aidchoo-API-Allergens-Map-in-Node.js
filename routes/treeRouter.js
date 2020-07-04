const express = require("express");
// Add our tree router
const treeRouter = express.Router();
// Require the tree controller
const treeController = require("../controllers/treeController.js");

treeRouter
  .route("/all")
  .get(treeController.getTrees);

treeRouter
  .route("/search/:commonName")
  .get(treeController.getTreeByCommonName);

treeRouter
  .route("/inSeason")
  .get(treeController.getTreeBySeason);

treeRouter
  .route("/nearby")
  .get(treeController.getStandardLocationTrees)
  .post(treeController.getNearbyTrees);

// Invalid route
treeRouter.all("*", function (req, res) {
  throw new Error(res);
});

module.exports = treeRouter;
