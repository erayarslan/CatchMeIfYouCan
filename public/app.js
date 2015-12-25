var stage = new createjs.Stage("demoCanvas");
var max_width = stage.canvas.width;
var max_height = stage.canvas.height;

var size = 10;
var start_x = 100;
var start_y = 100;
var speed = 500;

var socket = io();

socket.on("connect", function () {
  console.log(socket);
});

var Players = {};

socket.on("move", function (data) {
  createjs.Tween.get(Players[data.id], {
    loop: false,
    override: true
  }).to({x: data.x, y: data.y}, speed, createjs.Ease.linear)
});

socket.on("spawn", function (data) {
  Players[data.id] = new createjs.Shape();
  Players[data.id].graphics.beginFill("Crimson").drawCircle(0, 0, size);
  Players[data.id].x = data.x || start_x;
  Players[data.id].y = data.y || start_y;

  Players[data.id].on("click", function (e) {
    console.log(e);
  });

  stage.addChild(Players[data.id]);

  console.log(Players);
});


stage.on("stagemousedown", function (e) {
  var x = e.stageX;
  var y = e.stageY;

  if (!(y > max_height - size || x > max_width - size)) {
    if (!(y < size || x < size)) {
      createjs.Tween.get(Players[socket.io.engine.id], {
        loop: false,
        override: true
      }).to({x: x, y: y}, speed, createjs.Ease.linear)
    }

    socket.emit("move", {
      x: x,
      y: y
    });
  }
});

createjs.Ticker.setFPS(60);
createjs.Ticker.on("tick", function (e) {
  stage.update(e);
});