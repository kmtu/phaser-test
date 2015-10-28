"use strict";

let GAME_WIDTH = 800;
let GAME_HEIGHT = 600;
let carBmd;
let bmd;
let car;
let isNewStroke = true;
let dt;

function adjust() {
    let divgame = document.getElementById("game");
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";
}

function preload() {
    carBmd = game.add.bitmapData(50, 35, 'car');
    carBmd.ctx.fillStyle = "#995500";
    carBmd.ctx.fillRect(0, 0, 50, 35);
    dt = 1.0 / game.time.desiredFps;
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    car = game.add.sprite(10, 10, carBmd);
    let v_fac = 200
    car.v = new Phaser.Point(Math.random(), Math.random()).multiply(v_fac, v_fac)

    bmd = game.add.bitmapData(GAME_WIDTH, GAME_HEIGHT);
    game.add.sprite(0, 0, bmd);
    bmd.ctx.beginPath();
    bmd.ctx.strokeStyle = "white";
}

function update() {
    if ((car.x < 0 && car.v.x < 0) || (car.x > game.width  - car.width && car.v.x > 0)) {
        car.v.x *= -0.8;
    }
    if ((car.y < 0 && car.v.y < 0) || (car.y > game.height - car.height && car.v.y > 0)) {
        car.v.y *= -0.8;
    }
    //car.x += car.v.x * game.time.physicsElapsed;
    //car.y += car.v.y * game.time.physicsElapsed;
    car.x += car.v.x * dt;
    car.y += car.v.y * dt;

    if (game.input.mousePointer.isDown) {
        if (isNewStroke) {
            bmd.ctx.moveTo(game.input.x, game.input.y);
        } else {
            bmd.ctx.lineTo(game.input.x, game.input.y);
        }
        bmd.ctx.lineWidth = 2;
        bmd.ctx.stroke();
        bmd.dirty = true;
        isNewStroke = false;
    }
    if (game.input.mousePointer.isUp) {
        isNewStroke = true;
    }
}

adjust();

window.addEventListener('resize', function () {
    adjust();
});

let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
