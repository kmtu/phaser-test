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
        if (this.speed != 0 && this._pathDistance <= this.path.distance) {
            this._pathDistance += this.speed * this.game.time.physicsElapsed;
            let pos = this.path.distanceToPosition(this._pathDistance);
            this.position.set(pos.x, pos.y);
        }
    }

    setPath(path, startDistance=0) {
        if (path !== null || path !== undefined) {
            this._pathDistance = startDistance;
            this.path = path;
            this.x = path.start;
            this.y = path.end;
        }
    }
}
