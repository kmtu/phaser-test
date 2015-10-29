export default class Car extends Phaser.Sprite {
    constructor(game, x=0, y=0) {
        super(game, 0, 0, game.cache.getBitmapData('car'));
        game.add.existing(this);
    }
}
