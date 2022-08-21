const axios = require("axios");
require("dotenv").config();

async function getDistance(start, end) {
  try {
    const response = await axios({
      method: "post",
      url: `https://api.openrouteservice.org/v2/directions/driving-car`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.OPEN_ROUTE_SERVICE_KEY}`,
      },
      data: {
        coordinates: [
          [start.long, start.lat],
          [end.long, end.lat],
        ],
      },
    });

    const distance = response.data.routes[0].summary.distance;
    return Math.round(distance);
  } catch (err) {
    return null;
  }
}

module.exports = {
  getDistance,
};
