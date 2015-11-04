import CarPool from 'js/CarPool';
import Path from 'js/Path';
import LineSegment from "js/LineSegment";

export default class Simulation extends Phaser.State {
    constructor(widthMeter, heightMeter, pixelPerMeter) {
        super();
        this.pixelPerMeter = pixelPerMeter;
        this.realWorldWidth = widthMeter;
        this.realWorldHeight = heightMeter;
        this.pixelWorldWidth = pixelPerMeter * widthMeter;
        this.pixelWorldHeight = pixelPerMeter * heightMeter;
        this.zoomFactor = 1.1;
        this.cameraMoveSpeed = 10;
        this._zoomLevel = 0;
        this.zoomWheelFactor = 0.002;
    }

    get zoomLevel() {
        return this._zoomLevel;
    }

    set zoomLevel(level) {
        let factor = Math.exp(level - this._zoomLevel);
        factor = this.zoomBy(factor);
    }

    init() {
        this.time.advancedTiming = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.camera.roundPx = false;
        document.body.oncontextmenu = function() { return false; };
    }

    preload() {
        this.stage.backgroundColor = '#2d2d2d';
        let carBmd = this.add.bitmapData(50, 35, 'car', true);
        carBmd.ctx.fillStyle = "#995500";
        carBmd.ctx.fillRect(0, 0, 50, 35);
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.world.setBounds(-this.pixelWorldWidth/2, -this.pixelWorldHeight/2, this.pixelWorldWidth, this.pixelWorldHeight);
        this.camera.focusOnXY(0, 0);
        this.cameraTween = this.add.tween(this.camera);
        let onTap = function(pointer,  doubleTap) {
            if (doubleTap) {
                this.cameraTween.stop();
                this.cameraTween = this.add.tween(this.camera);
                this.cameraTween.to({x: pointer.worldX - this.camera.width / 2,
                                     y: pointer.worldY - this.camera.height / 2},
                                    500, Phaser.Easing.Exponential.Out, true);
            }
        };
        this.input.onTap.add(onTap, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        this.input.mouse.mouseWheelCallback = (e) => {
            let level = this.zoomLevel - e.deltaY * this.zoomWheelFactor;
            this.cameraTween.stop();
            this.cameraTween = this.add.tween(this);
            this.cameraTween.to({zoomLevel: level}, 500, Phaser.Easing.Exponential.Out, true);
        };

        // world creation
        this.add.tileSprite(this.world.x, this.world.y, this.world.width, this.world.height, 'background');
        let carPool = new CarPool(this.game);
        let car = carPool.create(0, 0);

        let path = new Path();
        path.add(-10 * this.pixelPerMeter, 0);
        path.add(10 * this.pixelPerMeter, 0);
        //this.physics.enable(car, Phaser.Physics.ARCADE);
        //let v_fac = 200;
        //car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac);
        //car.body.collideWorldBounds = true;
        //car.body.bounce.setTo(1, 1);
        //car.body.syncBounds = true;
    }

    update() {
        // camera control
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.camera.y -= this.cameraMoveSpeed;
        }
        else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.camera.y += this.cameraMoveSpeed;
        }

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.camera.x -= this.cameraMoveSpeed;
        }
        else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.camera.x += this.cameraMoveSpeed;
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.Z)) {
            this.zoomIn();
        }
        else if (this.input.keyboard.isDown(Phaser.Keyboard.X)) {
            this.zoomOut();
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.R)) {
            this.resetCamera();
        }
    }

    render() {
        this.game.debug.text('FPS: ' + this.time.fps || 'FPS: --', 40, 40, "#00ff00");
        this.game.debug.cameraInfo(this.camera, 40, 64, "#00ff00");
        this.game.debug.text(`World.bounds: ${this.world.bounds.x}, ${this.world.bounds.y}, ${this.world.bounds.width}, ${this.world.bounds.height}`, 40, 150, "#00ff00");
        this.game.debug.text(`Physics.bounds: ${this.physics.arcade.bounds.x}, ${this.physics.arcade.bounds.y}, ${this.physics.arcade.bounds.width}, ${this.physics.arcade.bounds.height}`, 40, 170, "#00ff00");
        this.game.debug.text(`scale: ${this.world.scale.x}`, 40, 200, "#00ff00");
    }

    zoomBy(factor) {
        if (factor < 1) {
            let newWidth = this.world.bounds.width * factor;
            let newHeight = this.world.bounds.height * factor;
            let zoomFactor1 = factor;
            let zoomFactor2 = factor;

            if (newWidth < this.camera.view.width) {
                zoomFactor1 = this.camera.view.width / this.world.bounds.width;
            }
            if (newHeight >= this.camera.view.height) {
                zoomFactor2 = this.camera.view.height / this.world.bounds.height;
            }

            factor = Math.max(zoomFactor1, zoomFactor2);
        }
        this.world.scale.multiply(factor, factor);
        this.world.bounds.scale(factor, factor);
        this.world.setBounds(-this.world.width/2, -this.world.height/2, this.world.width, this.world.height);
        this.camera.focusOnXY(this.camera.view.centerX * factor, this.camera.view.centerY * factor);
        this._zoomLevel += Math.log(factor);
        return factor;
    }

    zoomIn(factor=this.zoomFactor) {
        this.zoomBy(factor);
    }

    zoomOut(factor=this.zoomFactor) {
        this.zoomBy(1/factor);
    }

    resetCamera() {
        this.camera.focusOnXY(0, 0);
        this.zoomLevel = 0;
    }
}
