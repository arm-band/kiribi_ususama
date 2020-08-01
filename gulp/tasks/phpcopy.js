const _         = require('../plugin');
const dir       = require('../dir');

//phpcopy
const phpcopy = () => {
    return _.gulp.src(
        [
            `${dir.src.php}/**/*.php`,
            `${dir.src.php}/**/*.md`,
            `${dir.src.php}/**/LICENSE`
        ],
        {
            ignore: [
                `${dir.src.php}/**/test/**`
            ]
        })
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'phpcopy'
            })
        }))
        .pipe(_.gulp.dest(dir.dist.html));
};

module.exports = phpcopy;
