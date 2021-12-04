const socket = io();
socket.on("message", (message) => {
  console.log(message);
});
socket.on("receiveMessage", (message) => {
  console.log(message);
});
socket.on("userLocation", (position) => {
  console.log(position);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("messageSent", message);
});

document.querySelector("#shareLocation").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return window.alert("Your Browser does not support geolocation");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("location", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});
