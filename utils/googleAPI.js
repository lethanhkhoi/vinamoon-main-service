const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const getAddress = (lat, lng) => {
  client
    .geocode({
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    })
    .then((r) => {
      const data = r.data.results[0].address_components;
      console.log(data);
      return data;
    })
    .catch((e) => {
      console.log(e);
      return [];
    });
};

module.exports = {
  getAddress,
};
