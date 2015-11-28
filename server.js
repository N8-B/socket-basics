var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers (socket) {
  var info = clientInfo[socket.id];
  var users = [];

  if (typeof info === 'undefined') {
    return;
  }

  Object.keys(clientInfo).forEach(function (socketId) {
    var userInfo = clientInfo[socketId];

    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Current users: ' + users.join(', '),
    timestamp: moment.valueOf()
  });
}

io.on('connection', function (socket) {
  console.log('User connected via socket.io!');
  // Message emitted by server on socket connect
  socket.emit('message', {
    name: 'System',
    text: 'Welcome to the chat application.',
    timestamp: moment().valueOf()
  });

  socket.on('disconnect', function () {
    var userData = clientInfo[socket.id];

    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('message', {
        name: 'System',
        text: userData.name + ' has left.',
        timestamp: moment.valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  socket.on('joinRoom', function (req) {
    console.log(req);
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: moment.valueOf()
    });
  });

  // Server listens for message event from client/connected socket
  socket.on('message', function (message) {
    console.log('Message received: ' + message.text);

    if (message.text === '@currentUsers') {
        sendCurrentUsers(socket);
    } else {
      // ...and broadcasts to all connected sockets (io.emit())
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
      // ...or all connected sockets except for the socket/user
      // who sent the message (socket.broadcast.emit())
      // socket.broadcast.emit('message', message);
    }
  });
});

http.listen(PORT, function () {
  console.log('Server started on localhost:' + PORT);
});
