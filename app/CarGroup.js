import Car from "app/Car";

export default class CarGroup extends Phaser.Group {
    constructor(game) {
        super(game);
        this.classType = Car;
    }
}
