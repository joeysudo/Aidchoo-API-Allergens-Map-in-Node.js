// Provide the controller a link to the user model
const tree = require("../models/tree");
const geolib = require("geolib");

// Definining constants for spring and summer tree seasons
// These do not strictly correspond to our 'normal' seasons
const SPRING_START = new Date(2020, 7, 15);
const SPRING_END = new Date(2020, 9, 28);
const SUMMER_START = new Date(2020, 9, 29);
const SUMMER_END = new Date(2021, 5, 1);

// Defining costantt distance calculation accuracy
const DIST_ACCURACY = 0.01;

// Defining default closeness threshold for nearby trees
const DEFAULT_METRES = 500;

// Standard locations
const STANDARD_LOCATIONS = [
  { name: "Emporium", lat: -37.8124, lon: 144.9639 },
  { name: "Flinders St Station", lat: -37.8183, lon: 144.9671 },
  { name: "The State Library", lat: -37.8098, lon: 144.9652 },
  { name: "NGV", lat: -37.8226, lon: 144.9689 },
  { name: "Southern Cross Station", lat: -37.8184, lon: 144.9525 },
  { name: "Flagstaff Gardens", lat: -37.8106, lon: 144.9545 },
  { name: "Royal Exhbition Building", lat: -37.8047, lon: 144.9717 },
  { name: "Unimelb Babel Building", lat: -37.797315, lon: 144.959379 }
];

// Function to calculate the curr pollen season
const calcSeason = (date) => {
  let season;
  if (date >= SPRING_START && date <= SPRING_END) {
    season = "Spring";
  } else if (date >= SUMMER_START && date <= SUMMER_END) {
    season = "Summer";
  } else {
    season = "Autumn or Winter";
  }
  return season;
};

// Function to return all allergen trees within a provided metere distance
// Also determines the given tree is currently in season
const findTreesByLocation = (trees, latitude, longitude, closeMetres) => {
  // Add the distance of the trees from the given location
  trees.map((tree, index) => {
    let distance = geolib.getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: tree.latitude, longitude: tree.longitude },
      (accuracy = DIST_ACCURACY)
    );
    tree.distance = distance;
  });

  // Filter to only trees within a specified distance
  const foundTrees = trees.filter((tree) => {
    return tree.distance <= closeMetres;
  });

  // Of the trees within a given distance, determine if they are in season
  foundTrees.map((tree, index) => {
    // Add whether the trees are in season
    const currDate = new Date();
    const currSeason = calcSeason(currDate);
    if (currSeason === tree.season || tree.season === "All year") {
      tree.inSeason = true;
    } else {
      tree.inSeason = false;
    }
  });
  return foundTrees;
};

// Function to search tree location by tree name
const getTreeByCommonName = async (req, res) => {
  try {
    const foundTrees = await tree.find({ commonName: req.params.commonName });
    res.status(200).send(foundTrees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to return all allergen trees in data base
const getTrees = async (req, res) => {
  try {
    const foundTrees = await tree.find();
    res.status(200).send(foundTrees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to return all in season allergen trees in the data base
const getTreeBySeason = async (req, res) => {
  try {
    const currDate = new Date();
    const currSeason = calcSeason(currDate);
    let inSeasonTrees;
    if (currSeason === "Autumn or Winter") {
      inSeasonTrees = await tree.find({ season: "All year" });
    } else {
      inSeasonTrees = await tree.find({
        $or: [{ season: currSeason }, { season: "All year" }],
      });
    }
    res.status(200).json({
      currentSeason: currSeason,
      inSeasonTrees: inSeasonTrees,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Returns all trees nearby a current location within a provided metre threshold
const getNearbyTrees = async (req, res) => {
  try {
    const allTrees = await tree.find();
    // To fix unusual parsing error
    const parsedTrees = JSON.parse(JSON.stringify(allTrees));

    const nearbyTrees = findTreesByLocation(
      parsedTrees,
      req.body.latitude,
      req.body.longitude,
      req.body.distance
    );

    res.status(200).send(nearbyTrees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Finds tree by standard Melbourne locations and returns them in a single JSON
const getStandardLocationTrees = async (req, res) => {
  try {
    // Deep copy the standard locations
    const standardLocations = JSON.parse(JSON.stringify(STANDARD_LOCATIONS));

    const allTrees = await tree.find();
    // To fix unusual parsing error
    const parsedTrees = JSON.parse(JSON.stringify(allTrees));

    standardLocations.map((location, index) => {
      location.trees = findTreesByLocation(
        parsedTrees,
        location.lat,
        location.lon,
        DEFAULT_METRES
      );
    });

    res.status(200).send(standardLocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export callbacks
module.exports = {
  getTreeByCommonName,
  getTrees,
  getTreeBySeason,
  getNearbyTrees,
  getStandardLocationTrees,
};
