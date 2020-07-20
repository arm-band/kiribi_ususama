const _         = require('../plugin');
const dir       = require('../dir');

//assets files
const assetscopy = () => {
    return _.gulp.src(
        [`${dir.src.assets}/**/*.pdf`, `${dir.src.assets}/**/*.docx`, `${dir.src.assets}/**/*.xlsx`, `${dir.src.assets}/**/*.pptx`]
    )
    .pipe(_.plumber())
    .pipe(_.gulp.dest(dir.dist.assets));
};

module.exports = assetscopy;
