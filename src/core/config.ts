/**
 * @description config
 */

import { Emitter } from 'event-emitter';
const ee = require('event-emitter');

const emitter: Emitter = new ee();

interface Iconfig {
    emitter?: Emitter;
    debuggerMode?: boolean;
}

export const config: Iconfig = {
    emitter: emitter,
    debuggerMode: false,
};

export const setConfig: Function = (obj: Iconfig) => {
    Object.assign(config, obj);
};
