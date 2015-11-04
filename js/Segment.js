export default class Segment {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.distance = 0;
        this.distanceToPosition = null;
    }
}
