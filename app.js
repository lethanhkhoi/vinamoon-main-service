const createError = require("http-errors");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const routerCustom = require("./routes/index.js");
const mongoose = require("mongoose");
const website = fs.readFileSync("view/index.html");
const config = require("./config/database.json");
const database = require("./utils/database");
const { Server } = require("socket.io");
const http = require("http");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

database.connectDatabase(() => {
  console.log("connect success");
});

routerCustom.bindRouter(app);
app.use(express.static("./view"));

app.get("/*", (req, res) => {
  res.send(website);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,POST",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", `${socket.id}`);

  socket.on("bookCar", (data) => {
    console.log(data);
    io.emit("bookCar", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, function () {
  console.log("Begin listen on port %s...", 3001);
});
module.exports = app;
