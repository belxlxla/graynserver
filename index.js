// index.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors()); // 모든 곳에서 접속 허용

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 나중에 실제 도메인으로 바꿔야 함
    methods: ["GET", "POST"]
  }
});

// 기본 접속 테스트용
app.get('/', (req, res) => {
  res.send('Grayn Chat Server is Running! 🚀');
});

// 소켓 연결 (채팅 로직)
io.on('connection', (socket) => {
  console.log('유저 접속함:', socket.id);

  socket.on('send_message', (data) => {
    // 받은 메시지를 방에 있는 모두에게 뿌림
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('유저 나감:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('SERVER RUNNING ON PORT 3000');
});