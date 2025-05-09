document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    const messageInput = document.querySelector('#message-input');
    const registerUsernameInput = document.querySelector('#register-username');
    const registerPasswordInput = document.querySelector('#register-password');
    const loginUsernameInput = document.querySelector('#login-username');
    const loginPasswordInput = document.querySelector('#login-password');
    const chatHistory = document.querySelector('#chat-history');
    const sendButton = document.querySelector('#send-button');
    const registerButton = document.querySelector('#register-button');
    const loginButton = document.querySelector('#login-button');
    const registerForm = document.querySelector('#register-form');
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
    const showLoginButton = document.querySelector('#show-login-button');
    const showRegisterButton = document.querySelector('#show-register-button');
    const colorInput = document.querySelector('#color-input');
    const registerMessage = document.querySelector('#register-message');
    const loginMessage = document.querySelector('#login-message');

    const roomSelect = document.createElement('select');
    const roomInput = document.createElement('input');
    const createRoomButton = document.createElement('button');
    const roomContainer = document.createElement('div');
    const roomPasswordInput = document.createElement('input');
    const joinRoomButton = document.createElement('button');

    roomInput.placeholder = 'Enter room name';
    roomPasswordInput.placeholder = 'Enter room password';
    createRoomButton.textContent = 'Create Room';
    joinRoomButton.textContent = 'Join Room';
    roomContainer.appendChild(roomSelect);
    roomContainer.appendChild(roomInput);
    roomContainer.appendChild(roomPasswordInput);
    roomContainer.appendChild(createRoomButton);
    roomContainer.appendChild(joinRoomButton);
    document.body.insertBefore(roomContainer, document.querySelector('.container'));

    let currentRoom = 'default';
    socket.emit('join room', currentRoom);

    createRoomButton.addEventListener('click', () => {
        const newRoom = roomInput.value.trim();
        const roomPassword = document.querySelector('#room-password').value.trim();

        if (newRoom && roomPassword) {
            socket.emit('create room', { room: newRoom, password: roomPassword }, (success, message) => {
                if (success) {
                    const option = document.createElement('option');
                    option.value = newRoom;
                    option.textContent = newRoom;
                    roomSelect.appendChild(option);
                    roomInput.value = '';
                    document.querySelector('#room-password').value = '';
                    showNotification('Room created successfully!');
                } else {
                    showNotification(message);
                }
            });
        } else {
            showNotification('Room name and password cannot be empty.');
        }
    });

    joinRoomButton.addEventListener('click', () => {
        const selectedRoom = roomSelect.value;
        const roomPassword = document.querySelector('#room-password').value.trim();

        if (selectedRoom && roomPassword) {
            socket.emit('join room with password', { room: selectedRoom, password: roomPassword }, (success, message) => {
                if (success) {
                    currentRoom = selectedRoom;
                    showNotification('Joined room successfully!');
                } else {
                    showNotification(message);
                }
            });
        } else {
            showNotification('Please select a room and enter the password.');
        }
    });

    roomSelect.addEventListener('change', () => {
        const selectedRoom = roomSelect.value;
        if (selectedRoom) {
            currentRoom = selectedRoom;
            socket.emit('join room', currentRoom);
        }
    });

    let username = '';
    let userColor = '#000000';
    let fileToSend = null;

    if (colorInput) {
        colorInput.addEventListener('input', (event) => {
            userColor = event.target.value;
        });
    }

    if (showLoginButton) {
        showLoginButton.addEventListener('click', function() {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

    if (showRegisterButton) {
        showRegisterButton.addEventListener('click', function() {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }

    document.getElementById('show-register-link').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });

    document.getElementById('show-login-link').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 1000);
    }

    if (registerButton) {
        registerButton.addEventListener('click', function() {
            const username = registerUsernameInput.value.trim();
            const password = registerPasswordInput.value.trim();

            if (username && password) {
                fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: username, password: password })
                })
                .then(response => response.text())
                .then(data => {
                    showNotification(data);
                    if (data === "Registration successful!") {
                        registerForm.style.display = 'none';
                        loginForm.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                showNotification('Username and password cannot be left empty.');
            }
        });

        registerForm.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && registerUsernameInput.value.trim() && registerPasswordInput.value.trim()) {
                event.preventDefault();
                registerButton.click();
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const usernameInput = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (usernameInput && password) {
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: usernameInput, password: password })
                })
                .then(response => response.text())
                .then(data => {
                    showNotification(data);
                    if (data === "Login successful!") {
                        loginForm.style.display = 'none';
                        chatContainer.style.display = 'block';
                        inputArea.style.display = 'flex';
                        username = usernameInput;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                showNotification('Username and password cannot be left empty.');
            }
        });

        loginForm.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && loginUsernameInput.value.trim() && loginPasswordInput.value.trim()) {
                event.preventDefault();
                loginButton.click();
            }
        });
    }

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
                room: currentRoom,
                username: username,
                text: messageInput.value,
                color: userColor,
                date: new Date().toISOString(),
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
        if (message.room === currentRoom) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            const messageDate = new Date(message.date).toLocaleString('en-GB', { timeZone: 'UTC' });
            messageElement.innerHTML = `
                <span class="username" style="background-color: ${message.color}">${message.username}</span>
                <span class="text">${message.text}</span>
                ${message.icon ? `<img src="${message.icon}" alt="File Icon" class="file-icon">` : ''}
                <span class="date">${messageDate}</span>
                <hr class="msgSeparator">
            `;
            chatHistory.appendChild(messageElement);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    });

    socket.on('chat history', (messages) => {
        chatHistory.innerHTML = '';
        messages.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            const messageDate = new Date(message.date).toLocaleString('en-GB', { timeZone: 'UTC' }); // Mostra l'ora in UTC
            messageElement.innerHTML = `
                <span class="username" style="background-color: ${message.color}">${message.username}</span>
                <span class="text">${message.text}</span>
                <span class="date">${messageDate}</span>
                <hr class="msgSeparator">
            `;
            chatHistory.appendChild(messageElement);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });

    socket.on('update users', (users) => {
        usersList.innerHTML = '';
        users.forEach((user) => {
            const userElement = document.createElement('li');
            userElement.textContent = user;
            usersList.appendChild(userElement);
        });
    });

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

    socket.on('online users', (users) => {
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            usersList.appendChild(li);
        });
    });
});