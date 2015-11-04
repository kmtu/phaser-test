import Point from "js/Point";
import Segment from "js/Segment";
import LineSegment from "js/LineSegment";

export default class Path {
    constructor() {
        this.reset();
    }

    get distance() {
        return this.accumDistance[this.accumDistance.length - 1];
    }

    get start() {
        if (this.segments.length > 0) {
            return this.segments[0].start;
        }
        else {
            return this._init;
        }
    }

    get end() {
        if (this.segments.length > 0) {
            return this.segments[this.segments.length - 1].end;
        }
        else {
            return null
        }
    }

    reset() {
        this.segments = [];
        this.accumDistance = [];
        this._init = null;
    }

    add(obj) {
        if (arguments.length == 1) {
            if (obj instanceof Point) {
                this._addPoint(obj);
            }
            else if (obj instanceof Segment) {
                this._addSegment(obj);
            }
            else if (obj instanceof Path) {
            }
        }
        else {
            let x = arguments[0];
            let y = arguments[1];
            this._addPoint(new Point(x, y));
        }
    }

    _addPoint(point) {
        if (this.end) {
            this._addSegment(new LineSegment(this.end, point));
        }
        else if (this.start) {
            throw "Unable to add point to an empty path";
        }
    }

    _addSegment(segment) {
        if (this.segments.length > 0) {
        }
        else {
            this.start = segment.start;
        }
        this.end = segment.end;

        //if (this.points.length > 0) {
            //let segment = new LineSegment();
            //segment.start = this.points[this.points.length - 1];
            //segment.end = point;
            //this.segments.push(segment);
            //this.accumDistance.push(this.accumDistance[this.accumDistance.length - 1] +
                                    //this.segments[this.segments.length - 1].length);
        //}
        //else {
            //this.accumDistance.push(0);
        //}
        //this.points.push(point);
    }

    removePoint(point=undefined) {
        let index;

        if (point === undefined) {
            index = this.points.length - 1;
        }
        else {
            index = this.points.indexOf(point);
        }

        this.removePointAt(index);
    }

    removePointAt(index) {
        if (index === this.points.length - 1) {
            this.segments.pop();
            this.accumDistance.pop();
            return this.points.pop();
        }
        else if (index === 0) {
            this.segments.shift();
            this.accumDistance.shift();
            let offset = this.accumDistance[0];
            this.accumDistance.forEach((e, i, a) => {a[i] = e - offset});
            return this.points.shift();
        }
        else {
            let oldLength = this.segments[index - 1].length + this.segments[index].length;
            this.segments[index].start = this.segments[index - 1].start;
            this.segments.splice(index - 1, 1);
            let newLength = this.segments[index - 1].length;
            this.accumDistance.splice(index, 1);
            let offset = newLength - oldLength;
            for (let i = index; i < this.accumDistance.length; i++) {
                this.accumDistance[i] += offset;
            }
            return this.points.splice(index, 1);
        }
    }

    distanceToPosition(distance) {
        let index = this.distanceToSegmentIndex(distance);
        let offset = distance - this.accumDistance[index + 1];
        this.segments[index].distanceToPosition(offset);
    }

    distanceToSegmentIndex(distance) {
        return this.segments.findIndex((e, i, a) => {
            return this.accumDistance[i + 1] > distance;
        });
    }
}
