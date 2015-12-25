var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sockets = {};

app.use(express.static('public'));

io.on('connection', function (socket) {
  io.emit("spawn", {id: socket.id});
  for (var i in sockets) {
    socket.emit("spawn", {id: sockets[i].id, x: sockets[i]._x, y: sockets[i]._y})
  }
  sockets[socket.id] = socket;

  socket.on("move", function (data) {
    socket._x = data.x;
    socket._y = data.y;

    socket.broadcast.emit("move", {
      x: data.x,
      y: data.y,
      id: socket.id
    });
  });

  socket.on('disconnect', function () {
    delete sockets[socket.id];
    io.emit("destroy", {id: socket.id});
  });
});

http.listen(3000);