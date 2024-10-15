const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ['GET', 'POST']
//     }
// });


app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('set username', (username) => {
        socket.username = username;
        io.emit('user connected', `${username} joined the chat.`);
    });

    socket.on('chat message', (msg) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        io.emit('chat message', {
            user: socket.username,
            text: msg,
            time: time,
        });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username} disconnected`);
        io.emit('user disconnected', `${socket.username} left the chat.`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
