var stage = new createjs.Stage("demoCanvas");
var max_width = stage.canvas.width;
var max_height = stage.canvas.height;
var Player = new createjs.Shape();
var Bot = new createjs.Shape();

var size = 10;
var start_x = 100;
var start_y = 100;

Player.graphics.beginFill("Crimson").drawCircle(0, 0, size);
Bot.graphics.beginFill("Blue").drawCircle(0, 0, size);

Player.x = start_x;
Player.y = start_y;

Bot.x = Math.floor((Math.random() * max_height - size) + size);
Bot.y = Math.floor((Math.random() * max_height - size) + size);

var speed = 500;

stage.addChild(Player);
stage.addChild(Bot);

Player.on("click", function (e) {
  console.log("I AM THE PLAYER");
});

Bot.on("click", function (e) {
  console.log("I AM THE BOT");
});

stage.on("stagemousedown", function (e) {
  var x = e.stageX;
  var y = e.stageY;

  if (!(y > max_height - size || x > max_width - size)) {
    if (!(y < size || x < size)) {
      createjs.Tween.get(Player, {
        loop: false,
        override: true
      }).to({x: x, y: y}, speed, createjs.Ease.linear)
    }
  }
});

var botAi = setInterval(function () {
  var x = Math.floor((Math.random() * max_height - size) + size);
  var y = Math.floor((Math.random() * max_height - size) + size);

  createjs.Tween.get(Bot, {
    loop: false,
    override: true
  }).to({x: x, y: y}, speed, createjs.Ease.linear)
}, 250);

createjs.Ticker.setFPS(60);
createjs.Ticker.on("tick", function (e) {
  var pt = Player.localToLocal(0, 0, Bot);
  var hit = Math.sqrt(Math.pow(pt.x, 2) + Math.pow(pt.y, 2)) < size * 2 ;

  if (hit) {
    clearInterval(botAi);
    stage.removeChild(Bot);

    console.log("EXTERMINATE <3");
  }

  stage.update(e);
});