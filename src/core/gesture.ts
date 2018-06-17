/**
 * @description gesture
 */
import { config } from '@/core/config';

interface Iposition {
    centerX: number;
    centerY: number;
    zoom: number; // 缩放比例
}

export const position: Iposition = {
    centerX: 0,
    centerY: 0,
    zoom: 1,
};

export default class gesture {
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.init();
        this.event();
    }

    private init(): void {
        position.centerX = config.screenWidth / 2;
        position.centerY = config.screenHeight / 2;
    }

    private event(): void {}
}
