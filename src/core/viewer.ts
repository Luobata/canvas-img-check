/**
 * @description viewer Object
 */

import { config, setConfig } from '@/core/config';
import Gesture from '@/core/gesture';
import Img from '@/core/img';
import { Emitter } from 'event-emitter';

type EventListener = (...args: (Object | string)[]) => void;

let lastCalledTime: number;
let fps: number = 0;

export default class Viewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    // offscreen
    private offCanvas: HTMLCanvasElement;
    private offCtx: CanvasRenderingContext2D;

    private pixelRatio: number;
    private width: number;
    private height: number;
    private img: Img;
    private gesture: Gesture;

    private renderEvent: EventListener;

    private paintList: ImageData[] = [];

    constructor(debuggerMode: boolean = false) {
        // 展示fps
        setConfig({
            debuggerMode,
        });

        this.canvasInit();
        this.sizeInit();
        this.positionInit();
        this.contentInit();
        this.event();

        document.body.appendChild(this.canvas);
        this.reset();
        this.render();
    }

    public destroyed(): void {
        // event off
        config.emitter.off('render', this.renderEvent);
    }

    private event(): void {
        this.renderEvent = (): void => {
            this.render();
        };
        config.emitter.on('render', this.renderEvent);
    }

    private canvasInit(): void {
        this.canvas = document.createElement('canvas');
        this.offCanvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.offCtx = this.offCanvas.getContext('2d');
    }

    private sizeInit(): void {
        const width: number = window.innerWidth;
        const height: number = window.innerHeight;

        this.width = width;
        this.height = height;
        this.pixelRatio = window.devicePixelRatio;

        this.canvas.width = this.width * this.pixelRatio;
        this.canvas.height = this.height * this.pixelRatio;
        this.offCanvas.width = this.width * this.pixelRatio;
        this.offCanvas.height = this.height * this.pixelRatio;

        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.offCanvas.setAttribute('width', `${this.width}px`);
        this.offCanvas.setAttribute('height', `${this.height}px`);

        setConfig({
            screenWidth: width,
            screenHeight: height,
            pixelRatio: this.pixelRatio,
        });
    }

    private reset(): void {
        this.canvas.width = this.width * this.pixelRatio;
        this.canvas.height = this.height * this.pixelRatio;
        this.offCanvas.width = this.width * this.pixelRatio;
        this.offCanvas.height = this.height * this.pixelRatio;
    }

    private positionInit(): void {
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
    }

    private contentInit(): void {
        this.gesture = new Gesture(this.canvas);
        this.img = new Img(this.offCtx);
    }

    private backgroundRender(): void {
        this.offCtx.save();
        this.offCtx.fillStyle = 'black';
        this.offCtx.fillRect(
            0,
            0,
            this.width * this.pixelRatio,
            this.height * this.pixelRatio,
        );
        this.offCtx.restore();
    }

    private showFps(): void {
        if (!config.debuggerMode) {
            return;
        }

        if (!lastCalledTime) {
            lastCalledTime = Date.now();
            fps = 0;

            return;
        }
        const delta: number = (Date.now() - lastCalledTime) / 1000;
        lastCalledTime = Date.now();
        fps = 1 / delta;

        this.offCtx.save();
        this.offCtx.fillStyle = 'white';
        this.offCtx.font = '100px consolas';
        this.offCtx.textBaseline = 'top';
        this.offCtx.fillText(Math.floor(fps).toString(), 0, 0);
        this.offCtx.restore();
    }

    private syncCtx(): void {
        const startX: number = 0;
        const startY: number = 0;
        const width: number = this.width;
        const height: number = this.height;
        const data: ImageData = this.offCtx.getImageData(
            startX * this.pixelRatio,
            startY * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio,
        );

        this.ctx.putImageData(
            data,
            startX * this.pixelRatio,
            startY * this.pixelRatio,
        );
    }

    private render(): void {
        window.requestAnimationFrame(() => {
            this.reset();
            this.backgroundRender();
            this.img.render();
            this.showFps();
            this.syncCtx();
            if (this.img.renderList.length) {
                this.render();
            }
        });
    }
}
