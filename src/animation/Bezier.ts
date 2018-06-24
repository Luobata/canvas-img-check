/**
 * @description Bézier Curve
 */
import { Ipoint } from '@/common/interface';

export default class Bezier {
    private t: number;
    private start: Ipoint;
    private end: Ipoint;

    private center: Ipoint;
    constructor(center?: Ipoint) {
        this.start = {
            x: 0,
            y: 0,
        };
        this.end = {
            x: 1,
            y: 1,
        };
        this.center = center || {
            x: (this.start.x + this.end.x) / 2,
            y: (this.start.y + this.end.y) / 2,
        };
    }

    public getPoint(t: number): Ipoint {
        return {
            x:
                (1 - t) * (1 - t) * this.start.x +
                2 * t * (1 - t) * this.center.x +
                t * t * this.end.x,
            y:
                (1 - t) * (1 - t) * this.start.y +
                2 * t * (1 - t) * this.center.y +
                t * t * this.end.y,
        };
    }
}
