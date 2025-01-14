const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = new Set();

app.use(express.static(path.join(__dirname, 'src')));

let chatHistory = [];

io.on('connection', (socket) => {
    console.log('a user connected');
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
        console.log('user disconnected');
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

server.listen(80, () => {
    console.log('listening on *:80');
});