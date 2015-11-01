"use strict";

import Simulation from 'js/Simulation';

let gameWidth = 800;
let gameHeight = 600;
let worldWidthMeter = 90;
let worldHeightMeter = 70;
let pixelPerMeter = 10;
let divgame = document.getElementById("game");

function adjust() {
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";
}

adjust();
window.addEventListener('resize', function () {
    adjust();
});

let game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game');
let simState = new Simulation(game, worldWidthMeter, worldHeightMeter, pixelPerMeter);

game.state.add('Simulation', simState);
game.state.start('Simulation');
