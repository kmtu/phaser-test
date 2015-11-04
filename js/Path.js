import Point from "js/Point";
import Segment from "js/Segment";
import LineSegment from "js/LineSegment";

export default class Path {
    constructor() {
        this.segments = [];
        this.accumDistance = [];
        this._init = null;
    }

    get distance() {
        if (this.accumDistance.length > 0) {
            return this.accumDistance[this.accumDistance.length - 1];
        }
        else {
            return 0;
        }
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
        else if (this._init instanceof Point) {
            this._addSegment(new LineSegment(this._init, point));
            this._init = null;
        }
        else {
            this._init = point;
        }
    }

    _addSegment(segment) {
        if (this.segments.length > 0) {
            this.accumDistance.push(segment.distance + this.accumDistance[this.accumDistance.length - 1]);
        }
        else {
            this.accumDistance.push(segment.distance);
        }
        this.segments.push(segment);
    }

    removeLastSegment() {
        this.segments.pop();
        this.accumDistance.pop();
    }

    //removePointAt(index) {
        //if (index === this.points.length - 1) {
            //this.segments.pop();
            //this.accumDistance.pop();
            //return this.points.pop();
        //}
        //else if (index === 0) {
            //this.segments.shift();
            //this.accumDistance.shift();
            //let offset = this.accumDistance[0];
            //this.accumDistance.forEach((e, i, a) => {a[i] = e - offset});
            //return this.points.shift();
        //}
        //else {
            //let oldLength = this.segments[index - 1].length + this.segments[index].length;
            //this.segments[index].start = this.segments[index - 1].start;
            //this.segments.splice(index - 1, 1);
            //let newLength = this.segments[index - 1].length;
            //this.accumDistance.splice(index, 1);
            //let offset = newLength - oldLength;
            //for (let i = index; i < this.accumDistance.length; i++) {
                //this.accumDistance[i] += offset;
            //}
            //return this.points.splice(index, 1);
        //}
    //}

    distanceToPosition(distance) {
        if (distance < 0) {
            return this.start;
        }
        else if (distance > this.distance) {
            return this.end;
        }
        else {
            let index = this._distanceToSegmentIndex(distance);
            let offset = 0;
            if (index > 0) {
                offset = this.accumDistance[index - 1];
            }
            return this.segments[index].distanceToPosition(distance - offset);
        }
    }

    _distanceToSegmentIndex(distance) {
        return this.segments.findIndex((e, i, a) => {
            return this.accumDistance[i] > distance;
        });
    }
}
