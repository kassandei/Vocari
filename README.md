# Vocari - A Simple Web Chat

Vocari is a lightweight web chat app where users can log in with a username, send real-time messages, and access chat history even after reconnecting.

## Project Structure

```
Vocari
├── src
│   ├── index.html        # Chat interface
│   ├── styles
│   │   └── style.css     # Styling for the chat
│   ├── scripts
│   │   └── app.js        # Handles chat functionality
│   ├── php
│   │   ├── db.php       # Database connection
│   │   ├── login.php    # Handles user login
│   │   ├── register.php # Handles user registration
│
├── server.js             # Manages connections and messages
└── README.md             # Project documentation
```

## How It Works

The app runs on [vocari.me](https://vocari.me) using Node.js on port 443. The frontend is built with plain HTML, CSS, and JavaScript, interacting with the DOM for real-time updates. Socket.io and Express handle messaging, while PHP with MariaDB (running on localhost via phpwebserver) manages user authentication and chat history. Axios bridges communication between Node.js and the PHP backend.

## Usage

- First, register an account.
- Enter your username and log in.
- Type your message and hit Enter to send.
- Messages update in real-time for all users.
- Chat history is saved even if you disconnect.

## Contributing

Got ideas or improvements? Feel free to open an issue or submit a pull request!

