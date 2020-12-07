const webpackTerser = require('terser-webpack-plugin');
const path          = require('path');
const glob          = require('glob');
const dir           = require('./gulp/dir');
const dotenv        = require('dotenv').config();

const mode = () => {
    return process.env.DEV_MODE === 'dev' ? 'development' : 'production';
};
const modeFlag = () => {
    return process.env.DEV_MODE === 'dev' ? false : true;
};
const entry = () => {
    const entries = glob
        .sync(
            '**/*.js',
            {
                ignore: [
                    '_plugins/**'
                ],
                cwd: dir.src.js
            }
        )
        .map(function (key) {
            return [key, path.resolve(dir.src.js, key)];
        });
    return Object.fromEntries(entries)
};
const configs = {
    mode: mode(),
    entry: entry(),
    output: {
        filename: '[name]'
    },
    optimization: {
            minimizer: [
            new webpackTerser({
                extractComments: 'some',
                terserOptions: {
                    compress: {
                        drop_console: modeFlag(),
                    },
                },
            }),
        ],
    }
};
if (process.env.DEV_MODE === 'dev') {
    configs.devtool = 'inline-source-map';
}

module.exports = configs;
