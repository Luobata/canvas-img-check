/**
 * @description gesture
 */
import { config } from '@/core/config';
import img from '@/core/img';
import Hammer from 'hammerjs';

export default class Gesture {
    private canvas: HTMLCanvasElement;

    private hammer: HammerManager;
    private tapListener: HammerListener;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.hammer = new Hammer(this.canvas);
        this.init();
        this.event();
    }

    public destroyed(): void {
        // event off
        this.hammer.off('tap', this.tapListener);
    }

    private init(): void {
        // wait for gesture
    }

    private event(): void {
        this.tapListener = (e: HammerInput): void => {
            img.SETCENTER(e.center.x, e.center.y);
            config.emitter.emit('zoom');
        };
        this.hammer.on('tap', this.tapListener);
    }
}
