"use strict";

import Car from "app/Car";

const pixelPerMeter = 10;
const worldWidthMeter = 90;
const worldHeightMeter = 70;
const worldWidthPixel = pixelPerMeter * worldWidthMeter;
const worldHeightPixel = pixelPerMeter * worldHeightMeter;
const gameWidth = 800;
const gameHeight = 600;

let lineBmd;
let isNewStroke = true;
let divgame = document.getElementById("game");
let cursors;

let game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game', { init: init, preload: preload, create: create, update: update, render: render });

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

    game.world.resize(worldWidthPixel, worldHeightPixel);
    cursors = game.input.keyboard.createCursorKeys();

    let car = new Car(game);
    game.physics.enable(car, Phaser.Physics.ARCADE);
    let v_fac = 200
    car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac)
    car.body.collideWorldBounds = true;
    car.body.bounce.setTo(0.8, 0.8);

    lineBmd = game.add.bitmapData(gameWidth, gameHeight);
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

    // camera controll
    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }
}

function render() {
    game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
    game.debug.cameraInfo(game.camera, 500, 32);
}
