"use strict";

let GAME_WIDTH = 800;
let GAME_HEIGHT = 600;
let carBmd;
let bmd;
let car;
let isNewStroke = true;

function adjust() {
    let divgame = document.getElementById("game");
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";
}

function preload() {
    carBmd = game.add.bitmapData(50, 35, 'car');
    carBmd.ctx.fillStyle = "#995500";
    carBmd.ctx.fillRect(0, 0, 50, 35);

    //  Advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated
    game.time.advancedTiming = true;
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = '#2d2d2d';

    car = game.add.sprite(10, 10, carBmd);
    game.physics.enable(car, Phaser.Physics.ARCADE);
    let v_fac = 200
    car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac)
    car.body.collideWorldBounds = true;
    car.body.bounce.setTo(0.8, 0.8);

    bmd = game.add.bitmapData(GAME_WIDTH, GAME_HEIGHT);
    game.add.sprite(0, 0, bmd);
    bmd.ctx.beginPath();
    bmd.ctx.strokeStyle = "white";
}

function update() {
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

function render() {
    //  FPS debug info
    game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
}

adjust();

window.addEventListener('resize', function () {
    adjust();
});

let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });
