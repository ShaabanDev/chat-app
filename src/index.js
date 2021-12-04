// import express
const express = require("express");
// import path module to help defining the public folder path
const path = require("path");
// import http module
const http = require("http");
const socketIO = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const pubPath = path.join(__dirname, "../public");
app.use(express.static(pubPath));

io.on("connection", (socket) => {
  socket.emit("message", "Welcome to our chat");

  socket.broadcast.emit("message", "A new user has joined");

  socket.on("messageSent", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      io.emit("message", filter.clean(message));
      callback();
      return;
    }
    io.emit("message", message);
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });

  socket.on("location", (position, callback) => {
    io.emit(
      "userLocation",
      `https://google.com/maps?q=${position.latitude},${position.longitude}`
    );
    callback();
  });
});

app.get("/", (req, res) => {
  res.render();
});

server.listen(process.env.PORT, () => {
  console.log("server is on port " + process.env.PORT);
});
