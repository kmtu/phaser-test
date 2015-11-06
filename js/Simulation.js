import CarPool from 'js/CarPool';
import Car from 'js/Car';
import Path from 'js/Path';
import LineSegment from "js/LineSegment";
import Direction from "js/Direction"

export default class Simulation extends Phaser.State {
    constructor(widthMeter, heightMeter, pixelPerMeter) {
        super();
        this.pixelPerMeter = pixelPerMeter;
        this.realWorldWidth = widthMeter;
        this.realWorldHeight = heightMeter;
        this.pixelWorldWidth = pixelPerMeter * widthMeter;
        this.pixelWorldHeight = pixelPerMeter * heightMeter;
        this.cameraMoveSpeed = pixelPerMeter;
        this.zoomFactor = 1.1;
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
        let carBmd = this.add.bitmapData(Car.spec.default.size.length * this.pixelPerMeter, Car.spec.default.size.width * this.pixelPerMeter, Car.spec.default.texture, true);
        carBmd.ctx.fillStyle = Car.spec.default.color;
        carBmd.ctx.fillRect(0, 0, carBmd.width, carBmd.height);
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.world.setBounds(-this.pixelWorldWidth/2, -this.pixelWorldHeight/2, this.pixelWorldWidth, this.pixelWorldHeight);
        this.resetCamera();
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

        let path = new Path();
        path.add(-10 * this.pixelPerMeter, 0);
        path.add(10 * this.pixelPerMeter, 0);
        path.add(20 * this.pixelPerMeter, 30 * this.pixelPerMeter);
        path.add(-20 * this.pixelPerMeter, -20 * this.pixelPerMeter);

        // render path for debug
        let pathBmd = this.add.bitmapData(this.world.width, this.world.height);
        let ctx = pathBmd.ctx;
        let lineColor = "green";
        let lineWidth = 5;
        ctx.translate(-this.world.x, -this.world.y);
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        for (let seg of path.segments) {
            ctx.lineTo(seg.end.x, seg.end.y);
        }
        ctx.strokeStyle = "green";
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.closePath();
        let pathSprite = this.game.add.sprite(this.world.x, this.world.y, pathBmd);

        let dotColor = "red";
        let dotRadius = 8;
        pathBmd.circle(path.start.x, path.start.y, dotRadius, dotColor);
        for (let seg of path.segments) {
            pathBmd.circle(seg.end.x, seg.end.y, dotRadius, dotColor);
        }

        let car = carPool.create(0, 0);
        car.setPath(path);
        car.speed = 10 * this.pixelPerMeter;
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
        this.game.debug.text(`scale: ${this.world.scale.x}`, 40, 175, "#00ff00");
        this.game.debug.text(`mouse at pixelWorld: ${this.input.mousePointer.worldX}, ${this.input.mousePointer.worldY}`, 40, 200, "#00ff00");
        this.game.debug.text(`mouse at physWorld: ${this.input.mousePointer.worldX / this.pixelPerMeter}, ${this.input.mousePointer.worldY / this.pixelPerMeter}`, 40, 225, "#00ff00");
    }

    zoomBy(factor) {
        let newWidth = this.world.bounds.width * factor;
        let newHeight = this.world.bounds.height * factor;
        let zoomFactor1 = factor;
        let zoomFactor2 = factor;

        if (newWidth < this.camera.view.width) {
            zoomFactor1 = this.camera.view.width / this.world.bounds.width;
        }
        if (newHeight < this.camera.view.height) {
            zoomFactor2 = this.camera.view.height / this.world.bounds.height;
        }
        factor = Math.max(zoomFactor1, zoomFactor2);

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
