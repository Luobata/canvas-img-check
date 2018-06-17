/**
 * @description img Object
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

export default class img {
    private ctx: CanvasRenderingContext2D;
    // private img: string; // img source
    private img: HTMLImageElement;
    private sx: number;
    private sy: number;
    private swidth: number;
    private sheight: number;
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private imgWidth: number;
    private imgHeight: number;

    private maxZoomScale: number = 5;
    private minZoomScale: number = 1;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.imgInit();
    }

    static setCenter(x: number, y: number): void {
        position.centerX = x;
        position.centerY = y;
        if (position.zoom === 1) {
            position.zoom = 2;
        } else {
            position.zoom = 1;
        }
        console.log(x, y);
    }

    private imgInit(): void {
        const image: HTMLImageElement = new Image();
        image.src = '../../test.jpg';
        image.onload = (): void => {
            this.img = image;
            this.imgWidth = image.width;
            this.imgHeight = image.height;
            config.emitter.emit('render');
        };

        position.centerX = config.screenWidth / 2;
        position.centerY = config.screenHeight / 2;
    }

    private getImageSize(): void {
        // 实际宽高
        let width: number;
        let height: number;
        if (this.imgWidth > config.screenWidth) {
            width = config.screenWidth;
            height = this.imgHeight / (this.imgWidth / config.screenWidth);
        } else {
            height = config.screenHeight;
            width = this.imgWidth / (this.imgHeight / config.screenHeight);
        }
        width = width * position.zoom;
        height = height * position.zoom;
        this.x = (config.screenWidth - width) / 2;
        this.y = (config.screenHeight - height) / 2;
        // sx sy 有问题 并且没考虑边界情况
        this.sx = (position.centerX - config.screenWidth / 2) * position.zoom;
        this.sy = (position.centerY - config.screenHeight / 2) * position.zoom;
        this.width = width;
        this.height = height;
        this.swidth = this.imgWidth / position.zoom;
        this.sheight = this.imgHeight / position.zoom;
    }

    public render(): void {
        if (!this.img) {
            return;
        }
        this.getImageSize();

        this.ctx.save();
        // this.ctx.scale(position.zoom, position.zoom);

        this.ctx.drawImage(
            this.img,
            config.pixelRatio * this.sx,
            config.pixelRatio * this.sy,
            config.pixelRatio * this.swidth, // 拉伸
            config.pixelRatio * this.sheight,
            config.pixelRatio * this.x,
            config.pixelRatio * this.y,
            config.pixelRatio * this.width, // 展示大小
            config.pixelRatio * this.height,
        );

        this.ctx.restore();
    }
}