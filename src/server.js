"use strict";

import express from 'express';
import http from 'http';
import io from 'socket.io';

var _app = express();
var _http = http.Server(_app);
var _io = io(_http);

var sockets = _io.sockets.connected;

_app.use(express.static(__dirname + '/../public'));

_io.on('connection', socket => {
  _io.emit("spawn", {
    id: socket.id
  });

  for (var i in sockets) {
    if (i !== socket.id) {
      socket.emit("spawn", {
        id: sockets[i].id,
        x: sockets[i]._x,
        y: sockets[i]._y
      });
    }
  }

  socket.on('move', data => {
    socket._x = data.x;
    socket._y = data.y;

    socket.broadcast.emit("move", {
      x: data.x,
      y: data.y,
      id: socket.id
    });
  });

  socket.on('disconnect', () => {
    _io.emit("destroy", {
      id: socket.id
    });
  });
});

_http.listen(3000);