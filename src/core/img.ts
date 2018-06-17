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
            this.x = 0;
            this.y = (config.screenHeight - height) / 2;
        } else {
            height = config.screenHeight;
            width = this.imgWidth / (this.imgHeight / config.screenHeight);
            this.y = 0;
            this.x = (config.screenWidth - width) / 2;
        }
        this.sx = 0;
        this.sy = 0;
        this.width = width;
        this.height = height;
        this.swidth = this.imgWidth;
        this.sheight = this.imgHeight;
    }

    public render(): void {
        if (!this.img) {
            return;
        }

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
    }
}
