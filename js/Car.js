import Direction from "js/Direction"

export default class Car extends Phaser.Sprite {
    constructor(game, x, y, key, frame) {
        super(game, x, y, key, frame);
        this.anchor.set(0.5, 0.5);
        this.speed = 0;
        this.path = null;
        this._pathDistance = 0;
    }

    update() {
        //this.rotation += 0.1;
        let dt = this.game.time.physicsElapsed;
        if (this.speed != 0) {
            this._pathDistance += this.speed * this.game.time.physicsElapsed * this.direction;
            let pos = this.path.distanceToPosition(this._pathDistance);
            let angle = this.path.distanceToAngle(this._pathDistance);
            this.position.set(pos.x, pos.y);
            this.rotation = angle;
        }
    }

    setPath(path, startDistance=0, direction=Direction.FORTH) {
        console.log(direction);
        if (path !== null || path !== undefined) {
            this._pathDistance = startDistance;
            this.path = path;
            this.position.set(path.start.x, path.start.y);
            this.direction = direction;
        }
    }
}

Car.spec = {
    default: {
        size: {
            length: 4.5,
            width: 2.0
        },
        texture: 'car_default',
        color: "#995500"
    }
}
