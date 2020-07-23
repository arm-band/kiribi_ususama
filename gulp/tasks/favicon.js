const _         = require('../plugin');
const dir       = require('../dir');

//favicon
const favicon = () => {
    return _.gulp.src(`${dir.src.favicon}/**/*.+(png|ico|icon)`)
    .pipe(_.plumber({
        errorHandler: _.notify.onError({
            message: 'Error: <%= error.message %>',
            title: 'favicon'
        })
    }))
    .pipe(_.gulp.dest(dir.dist.html));
};

module.exports = favicon;
