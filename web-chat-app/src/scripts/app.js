document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    const messageInput = document.getElementById('message-input');
    const usernameInput = document.getElementById('username-input');
    const chatHistory = document.getElementById('chat-history');
    const sendButton = document.getElementById('send-button');
    const loginButton = document.getElementById('login-button');
    const loginForm = document.getElementById('login-form');
    const chatContainer = document.getElementById('chat-container');

    let username = '';

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        username = usernameInput.value;
        if (username) {
            usernameInput.disabled = true;
            loginForm.style.display = 'none';
            chatContainer.style.display = 'block';
        }
    });

    sendButton.addEventListener('click', () => {
        if (messageInput.value && username) {
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
        messageElement.classList.add('message');
        messageElement.textContent = `${message.username}: ${message.text}`;
        chatHistory.appendChild(messageElement);
    });

    socket.on('chat history', (messages) => {
        chatHistory.innerHTML = ''; // Clear existing messages
        messages.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = `${message.username}: ${message.text}`;
            chatHistory.appendChild(messageElement);
        });
    });
});