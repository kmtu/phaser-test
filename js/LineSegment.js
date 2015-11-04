import Segment from "js/Segment"
import Line from "js/Line"

export default class LineSegment extends Segment {
    constructor(start, end) {
        super(start, end);
        this._line = new Line();
        this.start = start;
        this.end = end;
    }

    set start(point) {
        this._start = point;
        this._line.start = point;
    }

    get start() {
        return this._start;
    }

    set end(point) {
        this._end = point;
        this._line.end = point;
    }

    get end() {
        return this._end;
    }

    get distance() {
        return this._line.length;
    }

    distanceToPosition(distance) {
        let pos = this.normalizedTangent.multiply(distance, distance);
        return this.start.clone().add(pos.x, pos.y);
    }

    get normalizedTangent() {
        return this.end.clone().subtract(this.start).normalize();
        //return (new Phaser.Point(this.end.x - this.start.x, this.end.y - this.start.y)).normalize;
    }
}
