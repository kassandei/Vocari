document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    const messageInput = document.getElementById('message-input');
    const usernameInput = document.getElementById('username-input');
    const chatHistory = document.getElementById('chat-history');
    const sendButton = document.getElementById('send-button');

    let username = '';

    usernameInput.addEventListener('change', (event) => {
        username = event.target.value;
        usernameInput.disabled = true; // Disable the input after setting the username
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