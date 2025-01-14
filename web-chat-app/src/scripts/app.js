const socket = new WebSocket('ws://vocari.me:80');

let username;
const messageInput = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');
const chatHistory = document.getElementById('chatHistory');

usernameInput.addEventListener('change', (event) => {
    username = event.target.value;
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && messageInput.value) {
        const message = {
            username: username,
            text: messageInput.value,
        };
        socket.send(JSON.stringify(message));
        messageInput.value = '';
    }
});

socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.username}: ${message.text}`;
    chatHistory.appendChild(messageElement);
});

socket.addEventListener('open', () => {
    console.log('Connected to the chat server');
});

socket.addEventListener('close', () => {
    console.log('Disconnected from the chat server');
});