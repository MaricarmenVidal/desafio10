const socket = io();

let user;
let chatBox = document.getElementById("chatBox");

socket.emit('message', 'Se ha conectado el websocket');

user = prompt("¡Bienvenid@! Por favor ingresa tu nombre");

if (user != null) {
  document.getElementById("user").innerHTML =
  "Bienvenid@ " + user + "!!";
}

chatBox.addEventListener("keyup", event => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
        socket.on("messageLogs", data => {
        let log = document.getElementById("messageLogs");
        let messages = "";
        
        data.forEach(message => {
            messages = messages + `${message.user} dice: ${message.message}</br>`;
        });
        log.innerHTML = messages;
        })
    }
});

