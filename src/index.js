// import express
const express = require("express");
// import path module to help defining the public folder path
const path = require("path");
// import http module
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const pubPath = path.join(__dirname, "../public");
app.use(express.static(pubPath));

io.on("connection", (socket) => {
  socket.emit("message", "Welcome to our chat");

  socket.broadcast.emit("message", "A new user has joined");

  socket.on("messageSent", (message) => {
    io.emit("receiveMessage", message);
  });
  socket.on('disconnect',()=>{
      io.emit('message','A user has left')
  })
});

app.get("/", (req, res) => {
  res.render();
});

server.listen(process.env.PORT, () => {
  console.log("server is on port " + process.env.PORT);
});
