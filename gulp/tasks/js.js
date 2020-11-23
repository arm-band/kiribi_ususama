const _         = require('../plugin');
const dir       = require('../dir');
const webpackConfig = require('../../weppack.config');

const jsBuild = () => {
    return _.webpackStream(webpackConfig)
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'jsLibBuild'
            })
        }))
        .pipe(_.rename((path) => {
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(_.gulp.dest(dir.dist.js));
};

module.exports = jsBuild;
