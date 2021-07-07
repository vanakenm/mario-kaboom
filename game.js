kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

loadRoot("https://i.imgur.com/");
loadSprite("coin", "wbKxhcd.png");
loadSprite("evil-shroom", "KPO3fR9.png");
loadSprite("brick", "pogC9x5.png");
loadSprite("block", "bdrLpi6.png");
loadSprite("mario", "Wb1qfhK.png");
loadSprite("mushroom", "0wMd92p.png");
loadSprite("surprise", "gesQ1KP.png");
loadSprite("unboxed", "bdrLpi6.png");
loadSprite("pipe-top-left", "ReTPiWY.png");
loadSprite("pipe-top-right", "hj2GK4n.png");
loadSprite("pipe-bottom-left", "c1cYSbt.png");
loadSprite("pipe-bottom-right", "nqQ79eI.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                       ",
    "                                       ",
    "                                       ",
    "                                       ",
    "                                       ",
    "       %  =%=*=                        ",
    "                                       ",
    "                            +-         ",
    "                       ^  ^ ()         ",
    "==============================   ======",
  ];

  const levelConfig = {
    width: 20,
    height: 20,
    "$": [sprite("coin")],
    "#": [sprite("mushroom"), "mushroom", body()],
    "=": [sprite("brick"), solid()],
    "{": [sprite("unboxed"), solid()],
    "%": [sprite("surprise"), solid(), 'coin-surprise'],
    "*": [sprite("surprise"), solid(), 'mushroom-surprise'],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
    "+": [sprite("pipe-top-left"), solid(), scale(0.5)],
    "-": [sprite("pipe-top-right"), solid(), scale(0.5)],
    "^": [sprite("evil-shroom", solid())],
  };

  const gameLevel = addLevel(map, levelConfig);

  add([text("test"), pos(30, 6), layer("ui"), { value: "test" }]);
  add([text("level " + "test"), pos(4, 6), layer("ui")]);

  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        timer = 0;
        isBig = true;
      },
    };
  }

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    big(),
    origin("bot"),
  ]);

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("{", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("{", obj.gridPos.sub(0, 0));
    }
  });

  player.collides("mushroom", (m) => {
    destroy(m)
    player.biggify(6)
  })

  action("mushroom", (m) => {
    m.move(30,0)
  })

  const MOVE_SPEED = 120;
  const JUMP_FORCE = 360;
  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  keyPress("space", () => {
    if (player.grounded()) {
      player.jump(JUMP_FORCE);
    }
  });
});

start("game");
