const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFromButton = $messageForm.querySelector("button");
const $shareLocationButton = document.querySelector("#shareLocation");
const $messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message:message.text,
    createdAt:moment(message.timestamp).format('h:m a')
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("userLocation", (position) => {
  console.log(position);
  const html = Mustache.render(locationTemplate, {
    url: position.url,
    createdAt:moment(position.timestamp).format('h:m a')
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = $messageFormInput.value;
  if (message === "") {
    return;
  }
  $messageFromButton.setAttribute("disabled", "disabled");
  socket.emit("messageSent", message, () => {
    $messageFromButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
  });
});

$shareLocationButton.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return window.alert("Your Browser does not support geolocation");
  }
  $shareLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("Location Shared");
        $shareLocationButton.removeAttribute("disabled");
      }
    );
  });
});
