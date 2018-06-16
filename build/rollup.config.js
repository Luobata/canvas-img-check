import rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';

const root = path.resolve(__dirname, './');
const port = 10002;

module.exports = {
    input: 'src/camel.ts',
    name: 'canvasImgCheck',
    sourcemap: true,
    output: {
        file: 'dist/canvas-img-check.esm.js',
        format: 'es',
        name: 'canvasImgCheck',
        sourcemap: true,
    },
    plugins: [
        // uglify(),
        resolve(),
        typescript(),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            presets: [['env', { modules: false }]],
        }),
        alias({
            ASSETS: path.resolve(__dirname, '../assets'),
        }),
    ],
    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
};
