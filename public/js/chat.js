const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFromButton = $messageForm.querySelector("button");
const $shareLocationButton = document.querySelector("#shareLocation");
const $messages = document.querySelector("#messages");
const $chatSideBar = document.querySelector(".chat__sidebar");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

const roomUsersTemplate = document.querySelector(
  "#room-users-template"
).innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  const $singleMessage = $messages.lastElementChild;

  const singleMessageStyles = getComputedStyle($singleMessage);

  const singleMessageMargin = parseInt(singleMessageStyles.marginBottom);

  const singleMessageHight = $singleMessage.offsetHeight + singleMessageMargin;

  const visibleHeight = $messages.offsetHeight;

  const contentHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visibleHeight

  if(contentHeight - singleMessageHight <= scrollOffset){
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.timestamp).format("h:m a"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("userLocation", (position) => {
  console.log(position);
  const html = Mustache.render(locationTemplate, {
    username: position.username,
    url: position.text,
    createdAt: moment(position.timestamp).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomChanges", ({ room, users }) => {
  $chatSideBar.innerHTML = "";
  const html = Mustache.render(roomUsersTemplate, { room, users });
  $chatSideBar.insertAdjacentHTML("beforeend", html);
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    window.alert(error);
    location.href = "/";
  }
});
