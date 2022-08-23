const pickingAddressCol = require("../dataModel/pickingAddressCol");
const axios = require("axios");

module.exports = (socket) => {
  socket.on("bookCar", async (request) => {
    try {
      console.log('request = ', request)
      const { data } = await axios.get(`${process.env.CACHE_URL}`, {
        params: {
          lat: request.origin.lat,
          long: request.origin.long,
          distance: 10000
        }
      });
      let drivers = data.locations;
      drivers = drivers.map(driver => ({ ...driver, member: JSON.parse(driver.member) }))
      drivers = drivers.filter(driver => driver.member.typeId === request.vehicleId)
      
      drivers.forEach(driver => {
        console.log(`emitting driver ${driver.member.number}`)
        socket.broadcast.emit(driver.member.number, request)
      })
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver update location", async (request) => {
    try {
      console.log({
        lat: request.lat,
        long: request.long,
        label: request.vehicle
      })
      const { data } = await axios.post(`${process.env.CACHE_URL}`, {
        lat: request.lat,
        long: request.long,
        label: JSON.stringify(request.vehicle)
      });
      console.log(data)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver remove location", async (request) => {
    try {
      console.log(request)
      const { data } = await axios.delete(`${process.env.CACHE_URL}`, {
        label: JSON.stringify(request.vehicle)
      });
      console.log(data)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver accept ride", async (request) => {
    try {
      console.log('driver accept', JSON.stringify(request.user.vehicle))
      const { data } = await axios.delete(`${process.env.CACHE_URL}`, {
        label: JSON.stringify(request.user.vehicle)
      });
      console.log(`emitting ${request.roomId}`)
      socket.broadcast.emit(request.roomId, request)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver cancel ride", async (request) => {
    try {
      console.log(request)
      socket.broadcast.emit(request.roomId, {
        status: 'Canceled'
      })
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}
