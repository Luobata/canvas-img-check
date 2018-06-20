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

type EventListener = (...args: (Object | string)[]) => void;

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

    // tmp animation value
    private dx: number;
    private dy: number;
    private dwidth: number;
    private dheight: number;

    private imgWidth: number;
    private imgHeight: number;

    private maxZoomScale: number = 5;
    private minZoomScale: number = 1;

    private zoomEvent: EventListener;
    private zoomFlash: number = 60; // zoom动画持续帧数 60帧

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.event();
        this.imgInit();
    }

    static setCenter(x: number, y: number): void {
        position.centerX = x;
        position.centerY = y;
        if (position.zoom === 1) {
            position.zoom = 2;
        } else {
            position.zoom = 1;
            position.centerX = config.screenWidth / 2;
            position.centerY = config.screenHeight / 2;
        }
    }

    private event(): void {
        this.zoomEvent = (): void => {
            // 动画计算
            this.getImageSize();
            config.emitter.emit('render');
        };
        config.emitter.on('zoom', this.zoomEvent);
    }

    private imgInit(): void {
        const image: HTMLImageElement = new Image();
        image.src = '../../test.jpg';
        image.onload = (): void => {
            this.img = image;
            this.imgWidth = image.width;
            this.imgHeight = image.height;
            this.getImageSize();
            this.syncPosition(this.dx, this.dy, this.dwidth, this.dheight);
            config.emitter.emit('render');
        };

        position.centerX = config.screenWidth / 2;
        position.centerY = config.screenHeight / 2;
    }

    private syncPosition(
        x: number,
        y: number,
        width: number,
        height: number,
    ): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    private getImageSize(): void {
        // 实际宽高
        let width: number;
        let height: number;
        let x: number;
        let y: number;
        if (this.imgWidth > config.screenWidth) {
            width = config.screenWidth;
            height = this.imgHeight / (this.imgWidth / config.screenWidth);
        } else {
            height = config.screenHeight;
            width = this.imgWidth / (this.imgHeight / config.screenHeight);
        }
        width = width * position.zoom;
        height = height * position.zoom;
        const centerX: number = config.screenWidth - position.centerX;
        const centerY: number = config.screenHeight - position.centerY;
        x = centerX - width / 2;
        y = centerY - height / 2;
        // sx sy 有问题 并且没考虑边界情况
        this.sx = 0;
        this.sy = 0;
        if (width >= config.screenWidth) {
            // 可能存在越界
            if (x + width < config.screenWidth) {
                x = config.screenWidth - width;
            } else if (x > this.sx) {
                x = this.sx;
            }
        }
        if (height >= config.screenHeight) {
            if (y + height < config.screenHeight) {
                y = config.screenHeight - height;
            } else if (y > this.sy) {
                y = this.sy;
            }
        }
        // 动画元素 x y width height
        this.dx = x;
        this.dy = y;
        this.dwidth = width;
        this.dheight = height;

        this.swidth = this.imgWidth;
        this.sheight = this.imgHeight;
    }

    public destroyed(): void {
        config.emitter.off('zoom', this.zoomEvent);
    }

    public render(): void {
        if (!this.img) {
            return;
        }

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
