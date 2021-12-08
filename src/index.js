// import express
const express = require("express");
// import path module to help defining the public folder path
const path = require("path");
// import http module
const http = require("http");
const socketIO = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIO(server);
const pubPath = path.join(__dirname, "../public");
app.use(express.static(pubPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit(
      "message",
      generateMessage(user.username, "Welcome to our chat")
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(user.username, `${user.username} has joined`)
      );

      io.to(user.room).emit('roomChanges',{
        room: user.room,
        users: getUsersInRoom(user.room)
      });

    callback();
  });

  socket.on("messageSent", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      io.to(user.room).emit(
        "message",
        generateMessage(user.username, filter.clean(message))
      );
      callback();
      return;
    }
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user)
    {
      io.to(user.room).emit(
        "message",
        generateMessage(user.username, `${user.username} has left`)
      );

      io.to(user.room).emit('roomChanges',{
        room: user.room,
        users: getUsersInRoom(user.room)
      });

    }    

  });

  socket.on("location", (position, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "userLocation",
      generateMessage(
        user.username,
        `https://google.com/maps?q=${position.latitude},${position.longitude}`
      )
    );
    callback();
  });
});

app.get("/", (req, res) => {
  res.render();
});

server.listen(port, () => {
  console.log("server is on port " + port);
});
