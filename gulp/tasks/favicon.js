const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const dir           = require('../dir');

//favicon
const favicon = () => {
    return src(`${dir.src.favicon}/**/*.+(png|ico|icon)`)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'favicon'
            })
        }))
        .pipe(dest(dir.dist.html));
};

module.exports = favicon;
