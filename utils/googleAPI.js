const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const getAddress = async (lat, lng) => {
  try {
    const response = await client.geocode({
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    });
    const data = response.data.results[0].address_components;
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = {
  getAddress,
};
