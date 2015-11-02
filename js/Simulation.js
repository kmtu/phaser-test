import CarGroup from 'js/CarGroup';

export default class Simulation extends Phaser.State {
    constructor(game, widthMeter, heightMeter, pixelPerMeter) {
        super(game);
        this.game = game;
        this.world = game.world;
        this.camera = game.camera;

        this.pixelPerMeter = pixelPerMeter;
        this.realWorldWidth = widthMeter;
        this.realWorldHeight = heightMeter;
        this.pixelWorldWidth = pixelPerMeter * widthMeter;
        this.pixelWorldHeight = pixelPerMeter * heightMeter;
        this.zoomFactor = 1.1;
        this.cameraMoveSpeed = 10;
        this._zoomLevel = 0;
    }

    get zoomLevel() {
        return this._zoomLevel;
    }

    set zoomLevel(level) {
        let factor = Math.exp(level - this._zoomLevel);
        factor = this.zoomBy(factor);
    }

    init() {
        this.game.time.advancedTiming = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.camera.roundPx = false;
    }

    preload() {
        this.game.stage.backgroundColor = '#2d2d2d';
        let carBmd = this.game.add.bitmapData(50, 35, 'car', true);
        carBmd.ctx.fillStyle = "#995500";
        carBmd.ctx.fillRect(0, 0, 50, 35);
        this.game.load.image('background', 'assets/background.png');
    }

    create() {
        this.world.setBounds(-this.pixelWorldWidth/2, -this.pixelWorldHeight/2, this.pixelWorldWidth, this.pixelWorldHeight);
        this.camera.focusOnXY(0, 0);
        this.cameraTween = this.game.add.tween(this.camera);
        let onTap = function(pointer,  doubleTap) {
            if (doubleTap) {
                this.cameraTween.stop();
                this.cameraTween = this.game.add.tween(this.camera);
                this.cameraTween.to({x: pointer.worldX - this.camera.width / 2,
                                     y: pointer.worldY - this.camera.height / 2},
                                    200, Phaser.Easing.Cubic.InOut, true);
            }
        };
        this.game.input.onTap.add(onTap, this);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        this.game.input.mouse.mouseWheelCallback = (e) => {
            let factor = Math.exp(-e.deltaY * 0.0005);
            this.zoomBy(factor);
        };

        // world creation
        this.game.add.tileSprite(this.world.x, this.world.y, this.world.width, this.world.height, 'background');
        let carGroup = new CarGroup(this.game);
        let car = carGroup.create(0, 0);
        this.game.physics.enable(car, Phaser.Physics.ARCADE);
        let v_fac = 200
        car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac)
        car.body.collideWorldBounds = true;
        car.body.bounce.setTo(1, 1);
        car.body.syncBounds = true;
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

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
            this.zoomIn();
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            this.zoomOut();
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
            this.resetCamera();
        }
    }

    render() {
        this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, 40, "#00ff00");
        this.game.debug.cameraInfo(this.camera, 40, 64, "#00ff00");
        this.game.debug.text(`World.bounds: ${this.world.bounds.x}, ${this.world.bounds.y}, ${this.world.bounds.width}, ${this.world.bounds.height}`, 40, 150, "#00ff00");
        this.game.debug.text(`Physics.bounds: ${this.game.physics.arcade.bounds.x}, ${this.game.physics.arcade.bounds.y}, ${this.game.physics.arcade.bounds.width}, ${this.game.physics.arcade.bounds.height}`, 40, 170, "#00ff00");
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
