/**
 * @description gesture
 */
import img from '@/core/img';
import { config } from '@/core/config';

export default class gesture {
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.init();
        this.event();
    }

    private init(): void {}

    private event(): void {
        this.canvas.addEventListener(
            'click',
            (e: MouseEvent): void => {
                img.setCenter(e.clientX, e.clientY);
                config.emitter.emit('render');
            },
        );
    }

    private destroyed(): void {}
}
