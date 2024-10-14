const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Сохраним имя пользователя в socket.
  socket.on('set username', (username) => {
    socket.username = username;
    io.emit('user connected', `${username} joined the chat.`);
  });

  socket.on('chat message', (msg) => {
    const time = new Date().toLocaleTimeString();
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