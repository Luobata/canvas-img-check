/**
 * @description config
 */

import { Emitter } from 'event-emitter';
const ee = require('event-emitter');

const emitter: Emitter = new ee();

interface Iconfig {
    emitter?: Emitter;
    debuggerMode?: boolean;
    screenWidth?: number;
    screenHeight?: number;
    pixelRatio?: number;
}

export const config: Iconfig = {
    emitter: emitter,
    debuggerMode: false,
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1,
};

export const setConfig: Function = (obj: Iconfig) => {
    Object.assign(config, obj);
};
