/**
 * @description gesture
 */
import { config } from '@/core/config';
import img from '@/core/img';
import Hammer from 'hammerjs';
import { Ipoint } from '@/common/interface';

export default class Gesture {
    private canvas: HTMLCanvasElement;

    private hammer: HammerManager;
    private tapListener: HammerListener;
    private swipeListener: HammerListener;
    private panListener: HammerListener;
    private panStartListener: HammerListener;
    private panEndListener: HammerListener;

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
        // tslint:disable no-backbone-get-set-outside-model
        this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        // tslint:enable no-backbone-get-set-outside-model

        this.tapListener = (e: HammerInput): void => {
            img.SETCENTER(e.center.x, e.center.y);
            config.emitter.emit('zoom');
        };
        this.swipeListener = (e: HammerInput): void => {
            console.log(e);
            config.emitter.emit('swipe', e);
        };

        let panCenter: Ipoint = {
            x: -1,
            y: -1,
        };
        this.panListener = (e: HammerInput): void => {
            if (e.isFirst) {
                panCenter = e.center;
            }
            if (panCenter.x !== -1) {
                config.emitter.emit('move', {
                    x: e.center.x - panCenter.x,
                    y: e.center.y - panCenter.y,
                });
                panCenter = e.center;
            }
            if (e.isFinal) {
                panCenter.x = -1;
            }
        };
        this.panStartListener = (e: HammerInput): void => {
            panCenter = e.center;
        };
        this.panEndListener = (e: HammerInput): void => {
            // console.log('pan end');
        };
        this.hammer.on('tap', this.tapListener);
        this.hammer.on('swipe', this.swipeListener);
        this.hammer.on('pan', this.panListener);
        this.hammer.on('panstart', this.panStartListener);
        this.hammer.on('panend', this.panEndListener);
    }
}
