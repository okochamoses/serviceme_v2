const axios = require("axios");
const { MAPS_API_KEY } = require("./keys");
const logger = require("./logger");

const findLongLat = async address => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${MAPS_API_KEY}`;
  const { lat, lng } = await axios
    .get(url)
    .then(res => {
      if (res.data.status !== "OK") {
        return false;
      }
      return res.data.results[0].geometry.location;
    })
    .catch(err => {
      logger.error(err);
      return false;
    });
  return { lng, lat };
};

module.exports = { findLongLat };
