const express = require('express');
const http = require('http'); // Change from https to http
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const users = new Set();

app.use(express.static(path.join(__dirname, 'src')));

let chatHistory = [];

// Load SSL certificate and key (no longer needed)
// const privateKey = fs.readFileSync(path.join(__dirname, 'vocari_me/private.key'), 'utf8');
// const certificate = fs.readFileSync(path.join(__dirname, 'vocari_me/vocari_me.crt'), 'utf8');
// const caBundle = fs.readFileSync(path.join(__dirname, 'vocari_me/vocari_me.pem'), 'utf8');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: caBundle
// };

// Create HTTP server
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

io.on('connection', (socket) => {
    console.log('a user connected via HTTP');
    socket.emit('chat history', chatHistory); // Send chat history to the new user

    socket.on('check username', (username, callback) => {
        if (users.has(username)) {
            callback(false);
        } else {
            users.add(username);
            socket.username = username;
            callback(true);
            io.emit('update users', Array.from(users)); // Update all clients with the new user list
        }
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            io.emit('update users', Array.from(users)); // Update all clients with the new user list
        }
    });

    socket.on('chat message', (message) => {
        chatHistory.push(message);
        io.emit('chat message', message);
    });
});

// Listen on port 3000
httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});