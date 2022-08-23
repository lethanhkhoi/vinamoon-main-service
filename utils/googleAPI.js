// const { Client } = require("@googlemaps/google-maps-services-js");
// const client = new Client({});
// require('dotenv').config();

const { config } = require("../config/constant");
const openrouteservice = require("openrouteservice-js");

const Geocode = new openrouteservice.Geocode({ api_key: config.ORS_KEY});

const getAddress = async (lat, lng) => {
  try {
    const result = await Geocode.reverseGeocode({
      point: { lat_lng: [lat, lng], },
      boundary_country: ["VN"],
      size: 1
    })
    return result?.features[0]?.properties?.label;
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = {
  getAddress,
};
