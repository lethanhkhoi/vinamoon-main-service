const express = require("express");
const cors = require("cors");
const routerCustom = require("./routes/index.js");
const database = require("./utils/database");
const http = require("http");
const morganMiddleware = require("./middlewares/morgan");
const { handleError } = require("./middlewares/errorHandler");
const logger = require("./logger/winston.js");
const { config } = require("./config/constant.js");
const {createSocket} = require("./socket/socket.js")
const app = express();

// const getAddress = require("./utils/googleAPI");
// getAddress(10.762836, 106.682482);

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morganMiddleware);
database.connectDatabase(() => {
  logger.info("Database connected");
  console.log("Database connected");
});
routerCustom.bindRouter(app);
app.use(handleError);

const server = http.createServer(app);

createSocket(server)

server.listen(config.PORT, function () {
  logger.info("Server is running", { port: config.PORT });
  console.log("Begin listen on port %s...", config.PORT);
});

module.exports = app;
