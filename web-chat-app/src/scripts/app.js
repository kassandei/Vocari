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

document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io('http://vocari.me');

    const form = document.getElementById('message-form');
    const input = document.getElementById('message-input');
    const messages = document.getElementById('messages');

    if (form && input && messages) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (input.value) {
                socket.emit('chat message', input.value);
                input.value = '';
            }
        });

        socket.on('chat message', function(msg) {
            const item = document.createElement('li');
            item.textContent = msg;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    }
});