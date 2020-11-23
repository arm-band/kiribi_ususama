const _         = require('./gulp/plugin');
const dir       = require('./gulp/dir');

const mode = () => {
    return process.env.DEV_MODE === 'dev' ? 'development' : 'production';
};
const modeFlag = () => {
    return process.env.DEV_MODE === 'dev' ? false : true;
};
const entry = () => {
    const entries = _.glob
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
            return [key, _.path.resolve(dir.src.js, key)];
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
            new _.webpackTerser({
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
