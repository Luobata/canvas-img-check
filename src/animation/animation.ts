/**
 * @description 动画的运行轨迹 调惨
 */
import { framePerSecond } from '@/common/static';

/**
 * @params {l: number} 位移的长度
 * @params {time: number} 位移的时间
 * @params {max: number} 最大位移位置 超过该位置则不继续变化 同时速度瞬间归0
 */
export const swipe: Function = (
    l: number,
    time: number,
    begin: number,
    max: number,
): number[] => {
    // v 初速度
    // a 加速度 默认为匀减速运动
    // t 减速到0所需要的时间
    // maxL 减速到0可位移的距离
    // lengthByTime 距离随时间变化的函数
    // speedByTime 速度随时间变化的函数
    // v 是否需要最大值
    const dir: number = l < 0 ? 1 : -1;
    let v: number = (time / l) * 500;
    const a: number = (-1 / 3) * 7000 * dir;
    // const a: number = -0.95;
    const MAX: number = 2300;
    if (v > MAX) {
        v = MAX;
    } else if (v < -MAX) {
        v = -MAX;
    }
    console.log(v);
    console.log(dir, begin, max);
    const t: number = Math.abs(v / a);
    const lengthByTime: Function = (frameTime: number): number => {
        return v * frameTime + (1 / 2) * a * frameTime * frameTime;
    };
    const speedByTime: Function = (frameTime: number): number => {
        return v + a * frameTime;
    };
    const maxL: number = lengthByTime(t);

    const valueList: number[] = [];
    for (let i: number = 1; i <= t * framePerSecond; i = i + 1) {
        const tmpTime: number = i / framePerSecond;
        const tmpLength: number = lengthByTime(tmpTime);
        const end: number = begin + tmpLength;
        if (end * dir < max) {
            valueList.push(max);
            break;
        } else {
            valueList.push(end);
        }
    }

    return valueList;
};
