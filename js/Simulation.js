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

        this.isNewStroke = true;
        this.lineBmd;
        this.mouseWorldPos = new Phaser.Point();
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

        this.game.add.tileSprite(this.world.x, this.world.y, this.world.width, this.world.height, 'background');

        let carGroup = new CarGroup(this.game);
        let car = carGroup.create(0, 0);
        this.game.physics.enable(car, Phaser.Physics.ARCADE);
        let v_fac = 200
        car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac)
        car.body.collideWorldBounds = true;
        car.body.bounce.setTo(1, 1);
        car.body.syncBounds = true;

        this.lineBmd = this.game.add.bitmapData(this.world.width, this.world.height);
        let line = this.game.add.sprite(this.world.x, this.world.y, this.lineBmd);
        this.lineBmd.ctx.beginPath();
        this.lineBmd.ctx.strokeStyle = "red";
    }

    update() {
        if (this.game.input.mousePointer.isDown) {
            this.mouseWorldPos.set((this.game.input.x + this.camera.x + this.world.width/2)/this.world.scale.x, (this.game.input.y + this.camera.y + this.world.height/2)/this.world.scale.y);
            if (this.isNewStroke) {
                this.lineBmd.ctx.moveTo(this.mouseWorldPos.x, this.mouseWorldPos.y);
            }
            else {
                this.lineBmd.ctx.lineTo(this.mouseWorldPos.x, this.mouseWorldPos.y);
            }
            this.lineBmd.ctx.lineWidth = 2;
            this.lineBmd.ctx.stroke();
            this.lineBmd.dirty = true;
            this.isNewStroke = false;
        }
        if (this.game.input.mousePointer.isUp) {
            this.isNewStroke = true;
        }

        // camera control
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.camera.y -= this.cameraMoveSpeed;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.camera.y += this.cameraMoveSpeed;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.camera.x -= this.cameraMoveSpeed;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
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
        this.world.scale.multiply(factor, factor);
        this.world.bounds.scale(factor, factor);
        this.world.setBounds(-this.world.width/2, -this.world.height/2, this.world.width, this.world.height);

        this.camera.focusOnXY(this.camera.view.centerX * factor, this.camera.view.centerY * factor);

        this.pixelPerMeter *= factor;
    }

    zoomIn(factor=this.zoomFactor) {
        this.zoomBy(factor);
    }

    zoomOut(factor=this.zoomFactor) {
        let newWidth = this.world.bounds.width / factor;
        let newHeight = this.world.bounds.height / factor;
        let zoomFactor1 = factor;
        let zoomFactor2 = factor;

        if (newWidth < this.camera.view.width) {
            zoomFactor1 = this.world.bounds.width / this.camera.view.width;
        }
        if (newHeight >= this.camera.view.height) {
            zoomFactor2 = this.world.bounds.height / this.camera.view.height;
        }

        factor = Math.min(zoomFactor1, zoomFactor2);
        this.zoomBy(1/factor);
    }

    resetCamera() {
        this.camera.focusOnXY(0, 0);
        this.zoomOut(this.world.scale.x);
    }
}
