document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    const messageInput = document.querySelector('#message-input');
    const usernameInput = document.querySelector('#username-input');
    const colorInput = document.querySelector('#color-input');
    const chatHistory = document.querySelector('#chat-history');
    const sendButton = document.querySelector('#send-button');
    const loginButton = document.querySelector('#login-button');
    const loginForm = document.querySelector('#login-form');
    const chatContainer = document.querySelector('#chat-container');
    const fileInput = document.querySelector('#file-input');
    const fileConfirmation = document.querySelector('#file-confirmation');
    const fileName = document.querySelector('#file-name');
    const fileIcon = document.querySelector('#file-icon');
    const confirmSend = document.querySelector('#confirm-send');
    const cancelSend = document.querySelector('#cancel-send');

    let username = '';
    let userColor = '#000000';
    let fileToSend = null;

    colorInput.addEventListener('input', (event) => {
        userColor = event.target.value;
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

    function sendMessage() {
        if (messageInput.value && username) {
            const message = {
                username: username,
                text: messageInput.value,
                color: userColor,
                date: new Date().toLocaleString(),
            };
            socket.emit('chat message', message);
            messageInput.value = '';
        }
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && username) {
            fileToSend = file;
            fileName.textContent = `Do you want to send the file "${file.name}"?`;
            fileIcon.src = URL.createObjectURL(file);
            fileIcon.style.display = 'block';
            fileConfirmation.style.display = 'block';
        }
    });

    confirmSend.addEventListener('click', () => {
        if (fileToSend && username) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const message = {
                    username: username,
                    text: `<a href="${e.target.result}" download="${fileToSend.name}">${fileToSend.name}</a>`,
                    color: userColor,
                    date: new Date().toLocaleString(),
                    icon: fileIcon.src,
                };
                socket.emit('chat message', message);
                fileToSend = null;
                fileConfirmation.style.display = 'none';
                fileIcon.style.display = 'none';
            };
            reader.readAsDataURL(fileToSend);
        }
    });

    cancelSend.addEventListener('click', () => {
        fileToSend = null;
        fileConfirmation.style.display = 'none';
        fileIcon.style.display = 'none';
    });

    socket.on('chat message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <span class="username" style="background-color: ${message.color}">${message.username}</span>
            <span class="text">${message.text}</span>
            ${message.icon ? `<img src="${message.icon}" alt="File Icon" style="width: 50px; height: 50px;">` : ''}
            <span class="date">${message.date}</span>
        `;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    });

    socket.on('chat history', (messages) => {
        chatHistory.innerHTML = ''; // Clear existing messages
        messages.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `
                <span class="username" style="background-color: ${message.color}">${message.username}</span>
                <span class="text">${message.text}</span>
                ${message.icon ? `<img src="${message.icon}" alt="File Icon" style="width: 50px; height: 50px;">` : ''}
                <span class="date">${message.date}</span>
            `;
            chatHistory.appendChild(messageElement);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    });
});