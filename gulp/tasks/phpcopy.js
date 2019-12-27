const _         = require('../plugin');
const dir       = require('../dir');

//phpcopy
const phpcopy = () => {
    return _.gulp.src(
        [`${dir.src.php}/**/*`, `!${dir.src.php}/.gitkeep`, `!${dir.src.php}/**/composer.json`, `!${dir.src.php}/**/*.md`, `!${dir.src.php}/**/composer.lock`]
    )
    .pipe(_.plumber())
    .pipe(_.gulp.dest(dir.dist.html));
};

module.exports = phpcopy;
