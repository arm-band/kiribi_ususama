const _         = require('../plugin')
const dir       = require('../dir')

//phpcopy
_.gulp.task('phpcopy', () => {
    return _.gulp.src(
        [`${dir.src.php}/**/*`, `!${dir.src.php}/.gitkeep`]
    )
    .pipe(_.plumber())
    .pipe(_.gulp.dest(dir.dist.html))
})