const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const users = new Set();

app.use(express.static(path.join(__dirname, 'src')));

let chatHistory = [];

// Load SSL certificate and key
const privateKey = fs.readFileSync(path.join(__dirname, 'vocari_me/private.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'vocari_me/vocari_me.crt'), 'utf8');
const caBundle = fs.readFileSync(path.join(__dirname, 'vocari_me/vocari_me.pem'), 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: caBundle
};

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);
const httpsIo = socketIo(httpsServer);

httpsIo.on('connection', (socket) => {
    console.log('a user connected via HTTPS');
    socket.emit('chat history', chatHistory); // Send chat history to the new user

    socket.on('check username', (username, callback) => {
        if (users.has(username)) {
            callback(false);
        } else {
            users.add(username);
            socket.username = username;
            callback(true);
            httpsIo.emit('update users', Array.from(users)); // Update all clients with the new user list
        }
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            httpsIo.emit('update users', Array.from(users)); // Update all clients with the new user list
        }
    });

    socket.on('chat message', (message) => {
        chatHistory.push(message);
        httpsIo.emit('chat message', message);
    });
});

httpsServer.listen(443, () => {
    console.log('HTTPS server listening on port 443');
});