"use strict";

import Car from "app/Car";

let GAME_WIDTH = 800;
let GAME_HEIGHT = 600;
let lineBmd;
let car;
let isNewStroke = true;
let divgame = document.getElementById("game");

let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game', { init: init, preload: preload, create: create, update: update, render: render });

function adjust() {
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";
}

function init() {
    adjust();
    window.addEventListener('resize', function () {
        adjust();
    });
}

function preload() {
    game.stage.backgroundColor = '#2d2d2d';
    let carBmd = game.add.bitmapData(50, 35, 'car', true);
    carBmd.ctx.fillStyle = "#995500";
    carBmd.ctx.fillRect(0, 0, 50, 35);
    game.cache.addBitmapData('car', carBmd);
}

function create() {
    //  Advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated
    game.time.advancedTiming = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;


    car = new Car(game);
    game.physics.enable(car, Phaser.Physics.ARCADE);
    let v_fac = 200
    car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac)
    car.body.collideWorldBounds = true;
    car.body.bounce.setTo(0.8, 0.8);

    lineBmd = game.add.bitmapData(GAME_WIDTH, GAME_HEIGHT);
    game.add.sprite(0, 0, lineBmd);
    lineBmd.ctx.beginPath();
    lineBmd.ctx.strokeStyle = "white";
}

function update() {
    if (game.input.mousePointer.isDown) {
        if (isNewStroke) {
            lineBmd.ctx.moveTo(game.input.x, game.input.y);
        } else {
            lineBmd.ctx.lineTo(game.input.x, game.input.y);
        }
        lineBmd.ctx.lineWidth = 2;
        lineBmd.ctx.stroke();
        lineBmd.dirty = true;
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
