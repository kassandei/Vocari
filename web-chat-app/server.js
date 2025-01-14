const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'src')));

let chatHistory = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('chat history', chatHistory); // Send chat history to the new user

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        chatHistory.push(msg); // Store the message in chat history
        io.emit('chat message', msg);
    });
});

server.listen(80, () => {
    console.log('listening on *:80');
});