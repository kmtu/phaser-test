"use strict";

import PhysWorld from 'app/PhysWorld';

const pixelPerMeter = 10;
const worldWidthMeter = 90;
const worldHeightMeter = 70;
const worldWidth = pixelPerMeter * worldWidthMeter;
const worldHeight = pixelPerMeter * worldHeightMeter;
const gameWidth = 800;
const gameHeight = 600;

let lineBmd;
let isNewStroke = true;
let divgame = document.getElementById("game");
let cursors;
let world;
let worldScale;
let physWorld;

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
    game.load.image('background', 'app/assets/background.png');
}

function create() {
    //  Advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated
    game.time.advancedTiming = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.world.resize(worldWidth, worldHeight);

    physWorld = new PhysWorld(game);

    game.add.tileSprite(0, 0, worldWidth, worldHeight, 'background', undefined, physWorld);

    let car = physWorld.carGroup.create(0, 0, game.cache.getBitmapData('car'));
    game.physics.enable(car, Phaser.Physics.ARCADE);
    let v_fac = 200
    car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac)
    car.body.collideWorldBounds = true;
    car.body.bounce.setTo(0.8, 0.8);

    lineBmd = game.add.bitmapData(gameWidth, gameHeight);
    game.add.sprite(0, 0, lineBmd);
    lineBmd.ctx.beginPath();
    lineBmd.ctx.strokeStyle = "red";
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

    // camera control
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        game.camera.y -= 4;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        game.camera.y += 4;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        game.camera.x -= 4;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        game.camera.x += 4;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.Z))
    {
        game.camera.y -= 4;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.X))
    {
        game.camera.y += 4;
    }
}

function render() {
    game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
    game.debug.cameraInfo(game.camera, 500, 32);
}
