const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  // 간단한 채팅 화면 보내기 (HTML)
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Grayn Chat</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          #messages { list-style-type: none; margin: 0; padding: 0; }
          #messages li { padding: 5px 10px; }
          #messages li:nth-child(odd) { background: #eee; }
        </style>
      </head>
      <body>
        <h2>Grayn Chat 💬</h2>
        <ul id="messages"></ul>
        <form id="form" action="">
          <input id="input" autocomplete="off" style="width: 80%;" /><button>Send</button>
        </form>
        <script src="/socket.io/socket.io.js"></script>
        <script>
          var socket = io();
          var form = document.getElementById('form');
          var input = document.getElementById('input');

          form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (input.value) {
              socket.emit('chat message', input.value);
              input.value = '';
            }
          });

          socket.on('chat message', function(msg) {
            var item = document.createElement('li');
            item.textContent = msg;
            document.getElementById('messages').appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
          });
        </script>
      </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});