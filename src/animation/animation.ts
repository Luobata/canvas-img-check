/**
 * @description 动画的运行轨迹 调惨
 */

/**
 * @params {l: number} 位移的长度
 * @params {time: number} 位移的时间
 * @params {t: nubmer} 当前时间点
 */
export const swipe: Function = (l: number, time: number, t: number): number => {
    const v: number = time / l;
    const a = 1 / 3;

    return v * t + (1 / 2) * a * t * t;
};
