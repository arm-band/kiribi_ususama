const _         = require('../plugin');
const dir       = require('../dir');

//assets files
const assetscopy = () => {
    return _.gulp.src(`${dir.src.assets}/**/*.+(pdf|docx|xlsx|pptx)`)
    .pipe(_.plumber())
    .pipe(_.gulp.dest(dir.dist.assets));
};

module.exports = assetscopy;
