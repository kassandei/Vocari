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
    const confirmSend = document.querySelector('#confirm-send');
    const cancelSend = document.querySelector('#cancel-send');
    const toggleUsersButton = document.querySelector('#toggle-users');
    const onlineUsers = document.querySelector('#online-users');
    const usersList = document.querySelector('#users-list');
    const inputArea = document.querySelector('.input-area');

    let username = '';
    let userColor = '#000000';
    let fileToSend = null;

    colorInput.addEventListener('input', (event) => {
        userColor = event.target.value;
    });

    document.getElementById('login-button').addEventListener('click', function() {
        username = usernameInput.value.trim();
        if (username) {
            socket.emit('check username', username, (isAvailable) => {
                if (isAvailable) {
                    usernameInput.disabled = true;
                    colorInput.disabled = true;
                    loginForm.style.display = 'none';
                    chatContainer.style.display = 'flex';
                    inputArea.style.display = 'flex'; // Show the input area
                    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
                    document.getElementById('game-buttons').style.display = 'none'; // Hide the game buttons
                } else {
                    alert('Username is already taken. Please choose another one.');
                }
            });
        } else {
            alert('Username cannot be left empty.');
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

    // Fix file upload to send as a downloadable link
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && username) {
            fileToSend = file;
            fileName.textContent = `Do you want to send the file "${file.name}"?`;
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
                };
                socket.emit('chat message', message);
                fileToSend = null;
                fileConfirmation.style.display = 'none';
            };
            reader.readAsDataURL(fileToSend);
        }
    });

    cancelSend.addEventListener('click', () => {
        fileToSend = null;
        fileConfirmation.style.display = 'none';
    });

    socket.on('chat message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <span class="username" style="background-color: ${message.color}">${message.username}</span>
            <span class="text">${message.text}</span>
            ${message.icon ? `<img src="${message.icon}" alt="File Icon" class="file-icon">` : ''}
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
                ${message.icon ? `<img src="${message.icon}" alt="File Icon" class="file-icon">` : ''}
                <span class="date">${message.date}</span>
            `;
            chatHistory.appendChild(messageElement);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    });

    socket.on('update users', (users) => {
        usersList.innerHTML = '';
        users.forEach((user) => {
            const userElement = document.createElement('li');
            userElement.textContent = user;
            usersList.appendChild(userElement);
        });
    });

    // Move the user list under and to the left of the button when pressed
    toggleUsersButton.addEventListener('click', () => {
        if (onlineUsers.style.display === 'none' || onlineUsers.style.display === '') {
            onlineUsers.style.display = 'block';
            const rect = toggleUsersButton.getBoundingClientRect();
            onlineUsers.style.top = `${rect.bottom + window.scrollY}px`;
            onlineUsers.style.left = `${rect.left + window.scrollX - onlineUsers.offsetWidth}px`;
        } else {
            onlineUsers.style.display = 'none';
        }
    });

    // Handle receiving the list of online users
    socket.on('online users', (users) => {
        usersList.innerHTML = ''; // Clear the list
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            usersList.appendChild(li);
        });
    });
});