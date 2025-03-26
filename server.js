const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const axios = require('axios');

const app = express();
const users = new Set();

app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    database: 'webchat'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    axios.post('http://localhost:8000/php/register.php', {
        username: username,
        password: password
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).send('Error: ' + error.message);
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    axios.post('http://localhost:8000/php/login.php', {
        username: username,
        password: password
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).send('Error: ' + error.message);
    });
});

io.on('connection', (socket) => {
    console.log('a user connected via HTTPS');

    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
        if (!chatHistory[room]) {
            chatHistory[room] = [];
        }
        socket.emit('chat history', chatHistory[room]);
    });

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
        const { room, text, username, color, date } = message;
        if (!chatHistory[room]) {
            chatHistory[room] = [];
        }
        chatHistory[room].push(message);
        io.to(room).emit('chat message', message);
    });
});

httpsServer.listen(443, () => {
    console.log('Server is running on port 443');
});