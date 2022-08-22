const pickingAddressCol = require("../dataModel/pickingAddressCol");
const axios = require("axios");

module.exports = (io, socket) => {
  socket.on("bookCar", async (request) => {
    try {
      console.log(request)
      const { data } = await axios.get(`${process.env.CACHE_URL}`, {
        params: {
          lat: request.origin.lat,
          long: request.origin.long,
          distance: 2000
      }
      });
      drivers = data.locations;
      drivers.forEach(driver => {
        socket.broadcast.emit(driver.member.number, {
          
        })
      })
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver update", async (request) => {
    try {
      console.log(request)
      // const { data } = await axios.post(`${process.env.CACHE_URL}`, {
      //   lat: request.lat,
      //   long: request.long,
      //   label: request.vehicle
      // });
      // console.log(data)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}
