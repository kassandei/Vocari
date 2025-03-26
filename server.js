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

const rooms = {};

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

    socket.on('create room', ({ room, password }, callback) => {
        if (rooms[room]) {
            callback(false, 'Room already exists.');
        } else {
            rooms[room] = { password, users: [] };
            callback(true, 'Room created successfully.');
        }
    });

    socket.on('join room with password', ({ room, password }, callback) => {
        if (rooms[room]) {
            if (rooms[room].password === password) {
                socket.join(room);
                rooms[room].users.push(socket.id);
                callback(true, 'Joined room successfully.');
            } else {
                callback(false, 'Incorrect password.');
            }
        } else {
            callback(false, 'Room does not exist.');
        }
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            io.emit('update users', Array.from(users));
        }
        for (const room in rooms) {
            rooms[room].users = rooms[room].users.filter((id) => id !== socket.id);
            if (rooms[room].users.length === 0) {
                delete rooms[room];
            }
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