/**
 * @description img Object
 */
import { swipe } from '@/animation/animation';
import { Ipoint } from '@/common/interface';
import { config } from '@/core/config';

interface Iposition {
    centerX: number;
    centerY: number;
    zoom: number; // 缩放比例
}

interface Irender {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const position: Iposition = {
    centerX: 0,
    centerY: 0,
    zoom: 1,
};

type EventListener = (...args: (Object | string)[]) => void;

export default class Img {
    // 每秒的帧数
    public static flashPerSecond: number = 60;
    public renderList: Irender[] = [];

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

    // 左右拖动最大位置
    private maxX: number;
    private minX: number;
    private maxY: number;
    private minY: number;

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
    private zoomFlash: number = 8; // zoom动画持续帧数 60帧 即1s

    private swipeEvent: EventListener;
    private moveEvent: EventListener;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.event();
        this.imgInit();
    }

    public static SETCENTER(x: number, y: number): void {
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

    public destroyed(): void {
        config.emitter.off('zoom', this.zoomEvent);
        config.emitter.off('swipe', this.swipeEvent);
    }

    public render(): void {
        if (!this.img) {
            return;
        }

        this.ctx.save();
        // this.ctx.scale(position.zoom, position.zoom);

        if (this.renderList.length) {
            const renderItem: Irender = this.renderList.shift();
            this.ctx.drawImage(
                this.img,
                config.pixelRatio * this.sx,
                config.pixelRatio * this.sy,
                // config.pixelRatio * this.swidth, // 拉伸
                // config.pixelRatio * this.sheight,
                this.swidth,
                this.sheight,
                config.pixelRatio * renderItem.x,
                config.pixelRatio * renderItem.y,
                config.pixelRatio * renderItem.width, // 展示大小
                config.pixelRatio * renderItem.height,
            );
            this.syncPosition(
                renderItem.x,
                renderItem.y,
                renderItem.width,
                renderItem.height,
            );
            if (this.renderList.length) {
                // config.emitter.emit('render');
            } else {
                // this.syncPosition(this.dx, this.dy, this.dwidth, this.dheight);
            }
        } else {
            this.ctx.drawImage(
                this.img,
                config.pixelRatio * this.sx,
                config.pixelRatio * this.sy,
                // config.pixelRatio * this.swidth, // 拉伸
                // config.pixelRatio * this.sheight,
                this.swidth,
                this.sheight,
                config.pixelRatio * this.x,
                config.pixelRatio * this.y,
                config.pixelRatio * this.width, // 展示大小
                config.pixelRatio * this.height,
            );
        }

        this.ctx.restore();
    }

    private event(): void {
        this.zoomEvent = (): void => {
            // 动画计算
            this.getImageSize();
            for (let i: number = 0; i <= this.zoomFlash; i = i + 1) {
                this.renderList.push({
                    x: this.x + ((this.dx - this.x) / this.zoomFlash) * i,
                    y: this.y + ((this.dy - this.y) / this.zoomFlash) * i,
                    width:
                        this.width +
                        ((this.dwidth - this.width) / this.zoomFlash) * i,
                    height:
                        this.height +
                        ((this.dheight - this.height) / this.zoomFlash) * i,
                });
            }
            // this.syncPosition(this.dx, this.dy, this.dwidth, this.dheight);
            config.emitter.emit('render');
        };

        this.swipeEvent = (e: HammerInput): void => {
            if (position.zoom === 1) {
                // 图片间切换
                // 如果没有下一张 放手弹回
            } else {
                // 整图滑动
                // v0t + 1/2 a t^2 = l
                // v0 由 delatY delatTime 决定
                // a 常数
                // 先计算Y方向
                const list: number[] = swipe(
                    e.deltaY,
                    e.deltaTime,
                    e.center.y,
                    0,
                );
            }
        };

        this.moveEvent = (delat: Ipoint): void => {
            if (position.zoom === 1) {
                // 图片间切换
                // 如果没有下一张 放手弹回
            } else {
                this.dx += delat.x;
                this.dy += delat.y;
                if (this.dx > this.maxX) {
                    this.dx = this.maxX;
                }
                if (this.dx < this.minX) {
                    this.dx = this.minX;
                }
                if (this.dy > this.maxY) {
                    this.dy = this.maxY;
                }
                if (this.dy < this.minY) {
                    this.dy = this.minY;
                }
                this.renderList.push({
                    x: this.dx,
                    y: this.dy,
                    width: this.dwidth,
                    height: this.dheight,
                });
                config.emitter.emit('render');
            }
        };
        config.emitter.on('zoom', this.zoomEvent);
        config.emitter.on('swipe', this.swipeEvent);
        config.emitter.on('move', this.moveEvent);
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

        this.minX = config.screenWidth - width;
        this.maxX = this.sx;
        this.minY = config.screenHeight - height;
        this.maxY = this.sy;
        // 动画元素 x y width height
        this.dx = x;
        this.dy = y;
        this.dwidth = width;
        this.dheight = height;

        this.swidth = this.imgWidth;
        this.sheight = this.imgHeight;
    }
}
