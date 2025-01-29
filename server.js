const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const users = new Set();

app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.urlencoded({ extended: true }));

let chatHistory = [];

const privateKey = fs.readFileSync('/home/robert/vocari_me/private.key', 'utf8');
const certificate = fs.readFileSync('/home/robert/vocari_me/vocari_me.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};

const httpsServer = https.createServer(credentials, app);
const io = socketIo(httpsServer);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

io.on('connection', (socket) => {
    console.log('a user connected via HTTPS');
    socket.emit('chat history', chatHistory);

    socket.on('check username', (username, callback) => {
        const query = 'SELECT username FROM users WHERE username = ?';
        db.query(query, [username], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                callback(false);
            } else {
                users.add(username);
                socket.username = username;
                callback(true);
                io.emit('update users', Array.from(users));
            }
        });
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            io.emit('update users', Array.from(users));
        }
    });

    socket.on('chat message', (message) => {
        chatHistory.push(message);
        io.emit('chat message', message);
    });
});

httpsServer.listen(443, () => {
    console.log('Server is running on port 443');
});