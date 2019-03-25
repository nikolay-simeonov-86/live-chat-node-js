// Query DOM
var message = document.getElementById('message'),
    chooseUsernameInput = document.getElementById('choose-username-input'),
    chooseUsernameButton = document.getElementById('choose-username-button'),
    chooseUsernameDiv = document.getElementById('choose-username'),
    username = document.getElementById('username'),
    myUsername = document.getElementById('my-username'),
    output = document.getElementById('output'),
    btn = document.getElementById('send'),
    sendToUser = document.getElementById('send-to-user'),
    broadcast = document.getElementById('broadcast'),
    chatFields = document.getElementById('chat-fields'),
    snackbar = document.getElementById('snackbar');

// Show Notification function
function showNotification() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// Make connection
var socket = io.connect('http://localhost:3000');

// Emit events
chooseUsernameButton.addEventListener('click', function () {
    if ('' != chooseUsernameInput.value) {
        chooseUsernameDiv.style.display = 'none';
        myUsername.innerHTML = chooseUsernameInput.value;
        chatFields.style.display = 'block';
        socket.emit('add-user', {
            username: chooseUsernameInput.value
        });
    }
});

btn.addEventListener('click', function(){
    socket.emit('chat', {
        username: myUsername.innerHTML,
        message: message.value
    });
    snackbar.innerHTML = 'Message sent';
    showNotification();
    message.value = "";
});

broadcast.addEventListener('click', function(){
    socket.emit('broadcasting', {
        username: myUsername.innerHTML,
        message: message.value
    });
    snackbar.innerHTML = 'Message sent';
    showNotification();
    message.value = "";
});

sendToUser.addEventListener('click', function(){
    socket.emit('send-to-user', {
        myUsername: myUsername.innerHTML,
        username: username.value,
        message: message.value
    });
    snackbar.innerHTML = 'Message sent';
    showNotification();
    message.value = "";
});

// Listen for events
socket.on('chat', function(data){
    output.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.message + '</p>';
});

socket.on('broadcasting', function(data){
    output.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.message + '</p>';
});

socket.on('send-to-user', function(data){
    output.innerHTML += '<p><strong>' + data.myUsername + ': </strong>' + data.message + '</p>';
    socket.emit('confirmation', data.username);
});

socket.on('disconnect', function(data){
    output.innerHTML += '<p><strong>' + data + '</strong></p>';
});

socket.on('user-joined', function(data){
    output.innerHTML += '<p><strong>' + data + '</strong></p>';
});

socket.on('confirmation', function () {
    snackbar.innerHTML = 'Message received';
    showNotification();
});