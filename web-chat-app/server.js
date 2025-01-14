const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let chatHistory = [];

app.use(express.static(path.join(__dirname, 'src')));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send chat history to the newly connected user
    socket.emit('chatHistory', chatHistory);

    socket.on('sendMessage', (data) => {
        chatHistory.push(data);
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(`Server is running on http://vocari.me:${PORT}`);
});