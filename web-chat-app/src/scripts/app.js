document.addEventListener('DOMContentLoaded', (event) => {
    const socket = new WebSocket('wss://vocari.me:443'); // Ensure the URL uses WSS for secure connection

    let username;
    const messageInput = document.getElementById('message-input');
    const usernameInput = document.getElementById('username-input');
    const chatHistory = document.getElementById('chat-history');

    if (usernameInput && messageInput && chatHistory) {
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
    } else {
        console.error('Required DOM elements not found');
    }
});