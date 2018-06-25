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
    private swipeListener: HammerListener;
    private panListener: HammerListener;
    private panStartListener: HammerListener;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.hammer = new Hammer(this.canvas);
        this.init();
        this.event();
    }

    public destroyed(): void {
        // event off
        this.hammer.off('tap', this.tapListener);
        this.hammer.off('swipe', this.swipeListener);
    }

    private init(): void {
        // wait for gesture
    }

    private event(): void {
        this.tapListener = (e: HammerInput): void => {
            img.SETCENTER(e.center.x, e.center.y);
            config.emitter.emit('zoom');
        };
        this.swipeListener = (e: HammerInput): void => {
            console.log(e);
            config.emitter.emit('swipe', e);
        };
        this.panListener = (e: HammerInput): void => {
            console.log(e);
            if (e.isFirst) {
                alert(1);
            }
            config.emitter.emit('move', e);
        };
        this.panStartListener = (e: HammerInput): void => {
            console.log(1, e);
        };
        this.hammer.on('tap', this.tapListener);
        this.hammer.on('swipe', this.swipeListener);
        this.hammer.on('pan', this.panListener);
        this.hammer.on('panstart', this.panStartListener);
    }
}
