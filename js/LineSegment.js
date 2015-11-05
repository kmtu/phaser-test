import Segment from "js/Segment"
import Line from "js/Line"

export default class LineSegment extends Segment {
    constructor(start, end) {
        super();
        this._line = new Line();
        this._line.start = start;
        this._line.end = end;
        this._distance = this._line.length;
    }

    set start(point) {
        this._line.start = point;
        this._distance = this._line.length;
    }

    get start() {
        return this._line.start;
    }

    set end(point) {
        this._line.end = point;
        this._distance = this._line.length;
    }

    get end() {
        return this._line.end;
    }

    get distance() {
        return this._distance;
    }

    get angle() {
        return this._line.angle;
    }

    distanceToPosition(distance) {
        let pos = this.normalizedTangent.multiply(distance, distance);
        return pos.add(this.start.x, this.start.y);
    }

    distanceToAngle(distance) {
        return this.angle;
    }

    get normalizedTangent() {
        return this.end.clone().subtract(this.start.x, this.start.y).normalize();
        //return (new Phaser.Point(this.end.x - this.start.x, this.end.y - this.start.y)).normalize;
    }
}
