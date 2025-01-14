document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    const messageInput = document.getElementById('message-input');
    const usernameInput = document.getElementById('username-input');
    const colorInput = document.getElementById('color-input');
    const colorDisplay = document.getElementById('color-display');
    const chatHistory = document.getElementById('chat-history');
    const sendButton = document.getElementById('send-button');
    const loginButton = document.getElementById('login-button');
    const emojiButton = document.getElementById('emoji-button');
    const emojiPicker = document.getElementById('emoji-picker');
    const loginForm = document.getElementById('login-form');
    const chatContainer = document.getElementById('chat-container');
    const fileInput = document.getElementById('file-input');

    let username = '';
    let userColor = '#000000';

    colorDisplay.addEventListener('click', () => {
        colorInput.click();
    });

    colorInput.addEventListener('input', (event) => {
        userColor = event.target.value;
        colorDisplay.style.backgroundColor = userColor;
    });

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        username = usernameInput.value;
        if (username) {
            usernameInput.disabled = true;
            colorInput.disabled = true;
            loginForm.style.display = 'none';
            chatContainer.style.display = 'flex';
        }
    });

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    emojiButton.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    });

    emojiPicker.addEventListener('emoji-click', (event) => {
        messageInput.value += event.detail.unicode;
        emojiPicker.style.display = 'none';
    });

    function sendMessage() {
        if (messageInput.value && username) {
            const message = {
                username: username,
                text: messageInput.value,
                color: userColor,
            };
            socket.emit('chat message', message);
            messageInput.value = '';
        }
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && username) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const message = {
                    username: username,
                    text: `<a href="${e.target.result}" download="${file.name}">${file.name}</a>`,
                    color: userColor,
                };
                socket.emit('chat message', message);
            };
            reader.readAsDataURL(file);
        }
    });

    socket.on('chat message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<span style="color: ${message.color}">${message.username}</span>: ${message.text}`;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    });

    socket.on('chat history', (messages) => {
        chatHistory.innerHTML = ''; // Clear existing messages
        messages.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `<span style="color: ${message.color}">${message.username}</span>: ${message.text}`;
            chatHistory.appendChild(messageElement);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    });
});