/**
 * @description img Object
 */

export default class img {
    private ctx: CanvasRenderingContext2D;
    img: HTMLImageElement;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public render(): void {}
}
