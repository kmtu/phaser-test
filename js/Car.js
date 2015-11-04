export default class Car extends Phaser.Sprite {
    constructor(game, x, y, key, frame) {
        super(game, x, y, key, frame);
        this.anchor.set(0.5, 0.5);
        this.velocity = new Phaser.Point();
        this.path = null;
    }

    update() {
        this.rotation += 0.1;
        this.x += this.velocity.x * this.game.time.physicsElapsed;
        this.y += this.velocity.y * this.game.time.physicsElapsed;
    }
}
