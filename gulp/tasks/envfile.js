const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const rename        = require('gulp-rename');
const dir           = require('../dir');

//envfile
const envfile = () => {
    return src(`${dir.src.envfile}/**/*`)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'envfile'
            })
        }))
        .pipe(rename({
            basename: ''
        }))
        .pipe(dest(dir.dist.html));
};

module.exports = envfile;
