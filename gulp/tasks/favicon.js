const _         = require('../plugin');
const dir       = require('../dir');

//favicon
const favicon = () => {
    return _.gulp.src(
        [`${dir.src.favicon}/**/*.png`, `${dir.src.favicon}/**/*.ico`, `${dir.src.favicon}/**/*.icon`]
    )
    .pipe(_.plumber())
    .pipe(_.gulp.dest(dir.dist.html));
};

module.exports = favicon;
