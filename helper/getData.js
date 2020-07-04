/*
The following code is adapted from
valentinog - '4 + 1 ways for making HTTP requests 
with Node.js: async/await edition' by Valentino Gagliardi
*/

const axios = require("axios");

const getData = async (url) => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (err) {
    return err.message;
  }
};

module.exports = getData;
