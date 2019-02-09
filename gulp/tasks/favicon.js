const _         = require('../plugin')
const dir       = require('../dir')

//favicon
_.gulp.task('favicon', () => {
    return _.gulp.src(
        [`${dir.src.favicon}/**/*`]
    )
    .pipe(_.plumber())
    .pipe(_.gulp.dest(dir.dist.html))
})