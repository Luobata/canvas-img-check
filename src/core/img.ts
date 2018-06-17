/**
 * @description img Object
 */
import { config } from '@/core/config';
import { position } from '@/core/gesture';

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

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.imgInit();
    }

    private imgInit(): void {
        const image: HTMLImageElement = new Image();
        image.src = '../../test.jpg';
        image.onload = (): void => {
            this.img = image;
            this.imgWidth = image.width;
            this.imgHeight = image.height;
            this.getImageSize();
            config.emitter.emit('render');
        };
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
        this.x = 0;
        this.y = (config.screenHeight - height) / 2;
        // this.x = position.centerX - config.screenWidth / 2;
        // this.y = position.centerY - config.screenHeight / 2;
        this.sx = 0;
        this.sy = 0;
        this.width = width;
        this.height = height;
        this.swidth = width;
        this.sheight = height;
    }

    public render(): void {
        if (!this.img) {
            return;
        }

        this.ctx.drawImage(
            this.img,
            this.sx,
            this.sy,
            this.swidth,
            this.sheight,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }
}
