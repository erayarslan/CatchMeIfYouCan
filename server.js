var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sockets = io.sockets.connected;

app.use(express.static('public'));

io.on('connection', function (socket) {
  // Spawn for all Players
  io.emit("spawn", {id: socket.id});

  // Already on Map Players Spawn for Me
  for (var i in sockets) {
    if (i !== socket.id) {
      socket.emit("spawn", {id: sockets[i].id, x: sockets[i]._x, y: sockets[i]._y});
    }
  }

  // Handle Move Action
  socket.on("move", function (data) {
    socket._x = data.x;
    socket._y = data.y;

    // Broadcast Move Action for Another Players
    socket.broadcast.emit("move", {
      x: data.x,
      y: data.y,
      id: socket.id
    });
  });

  // Handle Disconnect Event
  socket.on('disconnect', function () {
    // Destroy for all Players
    io.emit("destroy", {id: socket.id});
  });
});

http.listen(3000);