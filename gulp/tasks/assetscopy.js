const _         = require('../plugin');
const dir       = require('../dir');

//assets files
const assetscopy = () => {
    return _.gulp.src(`${dir.src.assets}/**/*.+(pdf|docx|xlsx|pptx)`)
    .pipe(_.plumber({
        errorHandler: _.notify.onError({
            message: 'Error: <%= error.message %>',
            title: 'assetscopy'
        })
    }))
    .pipe(_.gulp.dest(dir.dist.assets));
};

module.exports = assetscopy;
