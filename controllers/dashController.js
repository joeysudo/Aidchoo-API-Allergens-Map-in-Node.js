// To use axios package get data from external APIs
const getData = require("../helper/getData");
// Provide link to tip model
const tip = require("../models/tip");
// Require the dotenv
require("dotenv").config();

// Defining constants for tree pollen calculation
// Wind speeds considered the mid point of moderate winds on the beaufort scale
const WINDY_KMH = 25;
// Humidity where weather begins to be considered dry
const DRY_HUMIDITY = 40;
// Months that vaguely encompass the pollen seasons
const TREE_SEASON_START = new Date(2020, 7, 15);
const TREE_SEASON_END = new Date(2020, 9, 28);
const GRASS_SEASON_START = new Date(2020, 9, 1);
const GRASS_SEASON_END = new Date(2021, 1, 10);

// Possible user allergens and severity for verifying user input
const VALID_ALLERGENS = ["Tree", "Grass", "Weeds", "Pollution"]
const VALID_SEVERITY = ["High", "Medium", "Low", "None"]

// Obtain relevant data from external APIs
// Using VIC EPA to obtain air quality for Melbourne
const POLLUTION_CONNECT = "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/4afe6adc-cbac-4bf1-afbe-ff98d59564f9?X-API-Key=<key>"
// Using OpenWeather to obtain weather for Melbourne
const WEATHER_CONNECT = "https://api.openweathermap.org/data/2.5/weather?lat=-37.840935&lon=144.946457&appid=<key>&units=metric"
// Using Melbourne Pollen to obtain grass pollen data for Melbourne
const GRASS_CONNECT = "http://api-sub.pollenforecast.com.au/readapi/client/<key>/"

// Create URLs
const POLLUTION_URL = POLLUTION_CONNECT.replace("<key>", process.env.VICEPA_APIKEY);
const GRASS_URL = GRASS_CONNECT.replace("<key>", process.env.MELBPOLLEN_APIKEY);
const WEATHER_URL = WEATHER_CONNECT.replace("<key>",process.env.OPENWEATHER_APIKEY);

// Naive algorithm to compute overall likely tree pollen level
// Matches Breezometer's grass pollen scale index
function calcTreeValue(wind, humidity) {
  // Determine whether the weather is windy and dry
  const isWindy = wind > WINDY_KMH ? true : false;
  const isDry = humidity < DRY_HUMIDITY ? true : false;
  // Determine whether we are currently in general tree pollen season
  const currDate = new Date();
  const inSeason =
    currDate >= TREE_SEASON_START && currDate <= TREE_SEASON_END ? true : false;

  let index;
  if (isWindy && isDry && inSeason) {
    index = { level: 5, category: "Very High" };
  } else if ((isWindy && inSeason) || (isDry && inSeason)) {
    index = { level: 4, category: "High" };
  } else if ((isWindy && isDry) || inSeason) {
    index = { level: 3, category: "Moderate" };
  } else if (isWindy || isDry) {
    index = { level: 2, category: "Low" };
  } else {
    // Level is never reported 0 due to trees which bloom all year in Melb
    index = { level: 1, category: "Very Low" };
  }

  return (treeLevel = {
    displayName: "Tree",
    inSeason: inSeason,
    index: index,
  });
}

// Function to format grass pollen data as pulled from the MelbPollen API
function calcGrassValue(pollenReading) {
  const category = pollenReading;

  // Determine whether we are currently in general grass pollen season
  const currDate = new Date();
  const inSeason =
    currDate >= GRASS_SEASON_START && currDate <= GRASS_SEASON_END
      ? true
      : false;

  // Make Melbourne Pollen's categories conform to Aidchoo's index
  let index;
  if (category === "Low") {
    index = { level: 1, category: "Very Low" };
  } else if (category === "Moderate") {
    index = { level: 2, category: "Low" };
  } else if (category === "High") {
    index = { level: 3, category: "Moderate" };
  } else if (category === "Very High") {
    index = { level: 4, category: "High" };
  } else if (category == "Extreme") {
    index = { level: 5, category: "Very High" };
  }

  return (grassLevel = {
    displayName: "Grass",
    obtainedFrom: "Melbourne Pollen",
    inSeason: inSeason,
    index: index,
  });
}

// Function to format pollution data as pulled from the EPA API
function calcPollutionValue(healthAdvice, mainPollutant) {
  if (healthAdvice === undefined) {
    healthAdvice = "Good";
  }

  let level;
  // If humidity greater than 84% health advice will be undefined
  if (healthAdvice === "Good") {
    level = 1;
  } else if (healthAdvice === "Moderate") {
    level = 3;
  } else if (
    healthAdvice === "Poor" ||
    healthAdvice === "Very poor" ||
    healthAdvice === "Hazardous"
  ) {
    level = 5;
  }

  const index = {
    level: level,
    category: healthAdvice,
  };

  return (pollutionLevel = {
    displayName: "Pollution",
    obtainedFrom: "EPA Victoria",
    mainPollutant: mainPollutant,
    index: index,
  });
}

// Function to get parameters of a tip based on the current user
function getTipForUser(algns, sev, treeIndex, grassIndex, pollutionIndex) {
  //If severity is set to None, set it to Low for purpose of tip making
  if (sev === "None") {
    sev = "Low";
  }

  // If an user specifies no allergen or Weeds allergen (not yet supported), return generic tip
  if (algns.length === 0 || (algns.length === 1 && algns[0] === "Weeds")) {
    return (tipCont = {
      allergen: "None",
      severity: "None",
      index: 0,
    });
  }

  // Get the highest index among allergens the user has
  let algn = "";
  let maxIndex = 0;
  for (i = 0; i < algns.length; i++) {
    if (algns[i] === "Tree") {
      if (treeIndex >= maxIndex) {
        algn = "Tree";
        maxIndex = treeIndex;
      }
    } else if (algns[i] === "Grass") {
      if (grassIndex > maxIndex) {
        algn = "Grass";
        maxIndex = grassIndex;
      }
    } else if (algns[i] === "Pollution") {
      if (pollutionIndex > maxIndex) {
        algn = "Pollution";
        maxIndex = pollutionIndex;
      }
    }
  }

  return (tipCont = {
    allergen: algn,
    severity: sev,
    index: maxIndex,
  });
}

// Function to check if input allergens are valid
function checkAlgn(algn) {
  return VALID_ALLERGENS.includes(algn);
}

// Function to display a user's allergen dashboard based on their location
const getDash = async (req, res) => {
  try {

    let algns = req.body.allergens;
    let sev = req.body.severity;

    // If allergens is not valid input, terminate request
    if (!Array.isArray(algns)) {
      return res.status(400).json({
        message: "Input allergens must be an array."
      });
    } 

    // Remove duplicates
    algns = [...new Set(algns)];
    // Check if allegern array is empty or contains valid allergens
    if (!(algns.length === 0 || algns.every(checkAlgn))) {
      return res.status(400).json({
        message: "Input allergens must be one or many of [ " 
          + VALID_ALLERGENS + " ] or []"
      });
    }
    
    // If severity is not valid, terminate request
    if (!VALID_SEVERITY.includes(sev)) {
      return res.status(400).json({
        message: "Input severity invalid. Can be one of [ " 
          + VALID_SEVERITY +" ]"
      });
    }

    // Get current grass pollen value
    const grassData = await getData(GRASS_URL);
    const pollenReading = grassData.site_data[0].forecasts.forecasts[0].pollen_level;
    const grassValue = calcGrassValue(pollenReading);

    // Get current pollution value
    const pollutionData = await getData(POLLUTION_URL);
    const healthAdvice = pollutionData.siteHealthAdvices[0].healthAdvice;
    const mainPollutant = pollutionData.siteHealthAdvices[0].healthParameter;
    const pollutionValue = calcPollutionValue(healthAdvice, mainPollutant);

    // Get current weather and calculate tree pollen value
    const weatherData = await getData(WEATHER_URL);
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const treeValue = calcTreeValue(wind, humidity);

    // Get tip for the current user based on the allergen levels
    const tipCont = getTipForUser(
      algns,
      sev,
      treeValue.index.level,
      grassValue.index.level,
      pollutionValue.index.level
    );
    
    const newTip = await tip.findOne({
      allergen: tipCont.allergen,
      severity: tipCont.severity,
      index: tipCont.index,
    });

    res.status(200).json({
      treePollen: treeValue,
      grassPollen: grassValue,
      pollution: pollutionValue,
      tip: {
        allergen: newTip.allergen,
        severity: newTip.severity,
        message: newTip.message,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDash,
};
