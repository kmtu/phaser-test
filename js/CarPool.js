import Car from "js/Car";

export default class CarPool extends Phaser.Group {
    constructor(game) {
        super(game);
        this.classType = Car;
    }

    create(x, y) {
        return super.create(x, y, this.game.cache.getBitmapData(Car.spec.default.texture));
    }
}
