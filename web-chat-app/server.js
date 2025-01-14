const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');

const app = express();

// Load SSL certificate and key
const privateKey = fs.readFileSync('path/to/your/private.key', 'utf8');
const certificate = fs.readFileSync('path/to/your/certificate.crt', 'utf8');
const ca = fs.readFileSync('path/to/your/ca_bundle.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);
const io = socketIo(httpsServer);

app.use(express.static(path.join(__dirname, 'src')));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

httpsServer.listen(443, () => {
    console.log('listening on *:443');
});