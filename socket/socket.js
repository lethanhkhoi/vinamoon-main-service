const pickingAddressCol = require("../dataModel/pickingAddressCol");
const axios = require("axios");

module.exports = (socket) => {
  socket.on("bookCar", async (request) => {
    try {
      console.log('request', request)
      if (request.status == 'Canceled') {
        await axios.patch(`http://localhost:3001/requestBus/${request.roomId}`, {
          status: "Canceled"
        });
      }
      const { data } = await axios.get(`${process.env.CACHE_URL}`, {
        params: {
          lat: request.origin.lat,
          long: request.origin.long,
          distance: 4000
        }
      });
      let drivers = data.locations;
      drivers = drivers.map(driver => ({ ...driver, member: JSON.parse(driver.member) }))
      drivers = drivers.filter(driver => driver.member.typeId === request.vehicleId)
      console.log('drivers.length', drivers.length)
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
      const { data } = await axios.post(`${process.env.CACHE_URL}`, {
        lat: request.lat,
        long: request.long,
        label: JSON.stringify(request.vehicle)
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver send location for user", async (request) => {
    try {
      console.log(request)
      socket.broadcast.emit(request.roomId, request)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver remove location", async (request) => {
    try {
      console.log(request)
      const { data } = await axios.delete(`${process.env.CACHE_URL}`, { data:
        {
          label: JSON.stringify(request.vehicle)
        }
      });
      console.log(data)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver accept ride", async (request) => {
    try {
      console.log('driver accept', request)
      const { data } = await axios.delete(`${process.env.CACHE_URL}`, { data:
        {
          label: JSON.stringify(request.user.vehicle)
        }
      });
      console.log('debug', request.roomId)
      await axios.patch(`http://localhost:3001/requestBus/${request.roomId}`, {
        driver: {
          name: request.user.name,
          phone: request.user.phone
        },
        status: "Arriving"
      });
      console.log(`emitting ${request.roomId}`)
      socket.broadcast.emit(request.roomId, request)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });
  
  socket.on("driver finish ride", async (request) => {
    try {
      console.log('roomId', request)
      await axios.patch(`http://localhost:3001/requestBus/${request.roomId}`, {
        status: "Done"
      });
      socket.broadcast.emit(request.roomId, {
        status: "Done"
      })
      console.log('roomId', request)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver cancel ride", async (request) => {
    try {
      console.log('roomId', request)
      await axios.patch(`http://localhost:3001/requestBus/${request.roomId}`, {
        status: "Canceled"
      });
      socket.broadcast.emit(request.roomId, {
        status: "Canceled"
      })
      console.log('roomId', request)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}
