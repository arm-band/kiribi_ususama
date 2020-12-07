const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const dir           = require('../dir');

//assets files
const assetscopy = () => {
    return src(`${dir.src.assets}/**/*.+(pdf|docx|xlsx|pptx)`)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'assetscopy'
            })
        }))
        .pipe(dest(dir.dist.assets));
};

module.exports = assetscopy;
