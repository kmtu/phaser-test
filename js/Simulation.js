import CarGroup from 'js/CarGroup';

export default class Simulation extends Phaser.State {
    constructor(game, widthMeter, heightMeter) {
        super(game);
        this.game = game;
        this.pixelPerMeter = 10;
        this.worldWidth = this.pixelPerMeter * widthMeter;
        this.worldHeight = this.pixelPerMeter * heightMeter;
        this.isNewStroke = true;
        this.lineBmd;
        this.cursors;
    }

    preload() {
        this.game.stage.backgroundColor = '#2d2d2d';
        let carBmd = this.game.add.bitmapData(50, 35, 'car', true);
        carBmd.ctx.fillStyle = "#995500";
        carBmd.ctx.fillRect(0, 0, 50, 35);
        this.game.load.image('background', 'assets/background.png');
    }

    create() {
        this.game.time.advancedTiming = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        this.game.world.setBounds(-this.worldWidth/2, -this.worldHeight/2, this.worldWidth, this.worldHeight);
        this.game.camera.focusOnXY(0, 0);

        this.game.add.tileSprite(this.game.world.x, this.game.world.y, this.game.world.width, this.game.world.height, 'background');

        let carGroup = new CarGroup(this.game);

        let car = carGroup.create(0, 0, this.game.cache.getBitmapData('car'));
        this.game.physics.enable(car, Phaser.Physics.ARCADE);
        let v_fac = 200
        car.body.velocity.setTo(Math.random()*v_fac, Math.random()*v_fac)
        car.body.collideWorldBounds = true;
        car.body.bounce.setTo(0.8, 0.8);

        this.lineBmd = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        let line = this.game.add.sprite(this.game.world.x, this.game.world.y, this.lineBmd);
        this.lineBmd.ctx.beginPath();
        this.lineBmd.ctx.strokeStyle = "red";
    }

    update() {
        if (this.game.input.mousePointer.isDown) {
            if (this.isNewStroke) {
                this.lineBmd.ctx.moveTo(this.game.input.x + this.game.camera.x + this.game.world.width/2, this.game.input.y + this.game.camera.y + this.game.world.height/2);
            } else {
                this.lineBmd.ctx.lineTo(this.game.input.x + this.game.camera.x + this.game.world.width/2, this.game.input.y + this.game.camera.y + this.game.world.height/2);
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
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            this.game.camera.y -= 4;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            this.game.camera.y += 4;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            this.game.camera.x -= 4;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            this.game.camera.x += 4;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z))
        {
            this.game.camera.y -= 4;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.X))
        {
            this.game.camera.y += 4;
        }
    }

    render() {
        this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, 40, "#00ff00");
        this.game.debug.cameraInfo(this.game.camera, 500, 32);
    }
}
