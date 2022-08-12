const pickingAddressCol = require("../dataModel/pickingAddressCol");
const { Server } = require("socket.io");
const driver =[]
const createSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: "GET,POST,PUT, PATCH, DELETE",
    },
  });

  io.on("connection", (socket) => {
    logger.info(`User connected. SocketId: ${socket.id}`, {
      socketId: socket.id,
    });
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
  });
};
module.exports = {
  createSocket,
};
