/**
 * @description gesture
 */
import { config } from '@/core/config';
import img from '@/core/img';

export default class Gesture {
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.init();
        this.event();
    }

    public destroyed(): void {
        // event off
    }

    private init(): void {
        // wait for gesture
    }

    private event(): void {
        this.canvas.addEventListener(
            'click',
            (e: MouseEvent): void => {
                img.SETCENTER(e.clientX, e.clientY);
                config.emitter.emit('zoom');
            },
        );
    }
}
