const socket = io();
socket.on('welcomeMessage',(message)=>{
    console.log(message);
})
socket.on("receiveMessage", (message) => {
  console.log(message);
});


document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit("messageSent", message);
})
