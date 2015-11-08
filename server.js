var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  console.log('User connected via socket.io!');
  // Message emitted by server on socket connect
  socket.emit('message', {
    text: 'Welcome to the chat application.',
    timestamp: moment().valueOf()
  });
  // Server listens for message event from client/connected socket
  socket.on('message', function (message) {
    console.log('Message received: ' + message.text);
    // ...and broadcasts to all connected sockets (io.emit())
    message.timestamp = moment().valueOf();
    io.emit('message', message);
    // ...or all connected sockets except for the socket/user
    // who sent the message (socket.broadcast.emit())
    // socket.broadcast.emit('message', message);
  });
});

http.listen(PORT, function () {
  console.log('Server started.');
});
