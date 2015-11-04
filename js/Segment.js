export default class Segment {
    constructor() {
    }

    get start() {
        return null;
    }

    get end() {
        return null;
    }

    get distance() {
        return null;
    }

    distanceToPosition() {
        throw "distanceToPosition() must be overridden";
    }
}
