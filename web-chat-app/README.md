# Web Chat Application

This is a simple web chat application that allows users to log in with a username, exchange messages in real-time, and view the chat history even after reconnecting.

## Project Structure

```
web-chat-app
├── src
│   ├── index.html        # Main HTML document for the chat interface
│   ├── styles
│   │   └── style.css     # CSS styles for the chat application
│   └── scripts
│       └── app.js        # JavaScript code for handling chat functionality
├── server.js             # Server-side code for managing connections and messages
└── README.md             # Documentation for the project
```

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies by running:
   ```
   npm install
   ```
4. Start the server by executing:
   ```
   node server.js
   ```
5. Open your web browser and go to `http://vocari.me`.

## Usage Guidelines

- Enter a username to log in.
- Type your message in the input field and press Enter to send.
- All connected users will see the messages in real-time.
- The chat history will persist even if you disconnect and reconnect.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.