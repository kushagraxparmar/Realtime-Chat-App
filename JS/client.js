const socket = io("http://localhost:8000");

// Get DOM variables in respective Js variable
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Function which will append event to the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

//Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join Chad Chat");
socket.emit("new-user-joined", name);

//if a new user joins, receive the name from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

//if server sends a message, receive it
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

//if a user leaves the chat, append the info to the container
socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});

const clearInput = () => {
  messageInput.value = "";
};

//if the forms gets submitted, send the message to the server
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  clearInput();
});
