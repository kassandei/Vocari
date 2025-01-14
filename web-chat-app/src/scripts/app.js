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
    const socket = io('https://vocari.me'); // Ensure the URL uses HTTPS

    const form = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatHistory = document.getElementById('chat-history');
    const username = 'User'; // Replace with actual username logic

    if (form && messageInput && chatHistory) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (messageInput.value) {
                const message = {
                    username: username,
                    text: messageInput.value,
                };
                socket.emit('chat message', message);
                messageInput.value = '';
            }
        });

        socket.on('chat message', (message) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${message.username}: ${message.text}`;
            chatHistory.appendChild(messageElement);
        });

        socket.on('connect', () => {
            console.log('Connected to the chat server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the chat server');
        });
    } else {
        console.error('Required DOM elements not found');
    }
});