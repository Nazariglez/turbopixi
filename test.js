var game = new PIXI.Game();
game.start();

var g = new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawCircle(0,0,20)
    .endFill()
    .lineStyle(2, 0xffffff, 1)
    .moveTo(0,0)
    .lineTo(5,5)
    .generateTexture();

var player = new PIXI.Sprite(g)
    .addTo(game.stage);