import CarGroup from 'app/CarGroup';

export default class PhysWorld extends Phaser.Group {
    constructor(game) {
        super(game)
        this.carGroup = new CarGroup(game);
    }
}
