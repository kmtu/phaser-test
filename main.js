"use strict";

GAME_WIDTH = 600;
GAME_HEIGHT = 400;

adjust();

function adjust() {
    var divgame = document.getElementById("game");
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";
}

window.addEventListener('resize', function () {
    adjust();
});

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    carBmd = game.add.bitmapData(50, 35, 'car');
    carBmd.ctx.fillStyle = "#995500";
    carBmd.ctx.fillRect(0, 0, 50, 35);
}

function create() {
    game.renderer.renderSession.roundPixels = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    car = game.add.sprite(10, 10, carBmd);

    bmd = game.add.bitmapData(800, 600);
    line = game.add.sprite(0, 0, bmd);
    bmd.ctx.beginPath();
    bmd.ctx.strokeStyle = "white";
}

function update() {
    car.x += 1;
    car.y += 1;

    if (game.input.mousePointer.isDown) {
        bmd.ctx.lineTo(game.input.x, game.input.y);
        bmd.ctx.lineWidth = 2;
        bmd.ctx.stroke();
        bmd.dirty = true;
    }
}

