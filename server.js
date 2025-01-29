const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const phpExpress = require('php-express')({
    binPath: 'php' // Adjust the path to your PHP binary if necessary
});

const app = express();
const users = new Set();

app.use(bodyParser.urlencoded({ extended: true }));

// Use php-express to handle PHP files
app.use('/php', phpExpress.router);

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

let chatHistory = [];

// Load SSL certificate and key
const privateKey = fs.readFileSync('/home/robert/vocari_me/private.key', 'utf8');
const certificate = fs.readFileSync('/home/robert/vocari_me/vocari_me.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);
const io = socketIo(httpsServer);

io.on('connection', (socket) => {
    console.log('a user connected via HTTPS');
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

// Listen on port 443
httpsServer.listen(443, () => {
    console.log('Server is running on port 443');
});