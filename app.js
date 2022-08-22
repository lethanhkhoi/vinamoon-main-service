const express = require("express");
const cors = require("cors");
const routerCustom = require("./routes/index.js");
const database = require("./utils/database");
const http = require("http");
const fs = require("fs")
const website = fs.readFileSync("view/index.html")
const morganMiddleware = require("./middlewares/morgan");
const { handleError } = require("./middlewares/errorHandler");
const logger = require("./logger/winston.js");
const { config } = require("./config/constant.js");
// const socket = require("./socket/socket.js");
const { Server } = require("socket.io");
const app = express();

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
app.use(express.static("./view"));

app.get("/*",(req,res)=>{
  res.send(website)
})
app.use(handleError);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,POST",
  },
});

io.on("connection", (socket) => {
  console.log(`User connected. SocketId: ${socket.id}`)
  require("./socket/socket.js")(io, socket)
  return io
});

server.listen(config.PORT, function () {
  logger.info("Server is running", { port: config.PORT });
  console.log("Begin listen on port %s...", config.PORT);
});

module.exports = app;
