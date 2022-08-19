const pickingAddressCol = require("../dataModel/pickingAddressCol");
const axios = require("axios");

module.exports = (socket) => {
  socket.on("bookCar", (request) => {
    try {
      io.emit(request.roomId, "From server");
      logger.info(`Broadcast request from user ${socket.id}`, {
        request: request,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("driver update", async (request) => {
    try {
      console.log(request)
      const { data } = await axios.post(`${process.env.CACHE_URL}`, {
        lat: request.lat,
        long: request.long,
        label: request.driverId
      });
      console.log(data)
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  socket.on("location", (data) => {
    console.log(data);
    io.emit("bookCar", data);
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected. SocketId: ${socket.id}`, {
      socketId: socket.id,
    });
    console.log("User disconnected");
  });
}
