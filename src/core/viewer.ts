/**
 * @description viewer Object
 */

import Img from '@/core/img';

export default class Viewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    // offscreen
    private offCanvas: HTMLCanvasElement;
    private offCtx: CanvasRenderingContext2D;

    private pixelRatio: number;
    private width: number;
    private height: number;

    constructor() {
        this.canvasInit();
        this.sizeInit();
        this.positionInit();

        document.body.appendChild(this.canvas);
    }

    private canvasInit(): void {
        this.canvas = document.createElement('canvas');
        this.offCanvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.offCtx = this.offCanvas.getContext('2d');
    }

    private sizeInit(): void {
        const width: number = window.screen.width;
        const height: number = window.screen.height;

        this.width = width;
        this.height = height;
        this.pixelRatio = window.devicePixelRatio;

        this.canvas.width = this.width * this.pixelRatio;
        this.canvas.height = this.height * this.pixelRatio;
        this.offCanvas.width = this.width * this.pixelRatio;
        this.offCanvas.height = this.height * this.pixelRatio;

        this.canvas.setAttribute('width', `${this.width}px`);
        this.canvas.setAttribute('height', `${this.height}px`);
    }

    private positionInit(): void {
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
    }
}
