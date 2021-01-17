const { dest }      = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const rename        = require('gulp-rename');
const webpackStream = require('webpack-stream');
const dir           = require('../dir');
const webpackConfig = require('../../webpack.config');

const jsBuild = () => {
    return webpackStream(webpackConfig)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'jsLibBuild'
            })
        }))
        .pipe(rename((path) => {
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(dest(dir.dist.js));
};

module.exports = jsBuild;
