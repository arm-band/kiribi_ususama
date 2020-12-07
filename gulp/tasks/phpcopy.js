const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const dir           = require('../dir');

//phpcopy
const phpcopy = () => {
    return src(
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
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'phpcopy'
            })
        }))
        .pipe(dest(dir.dist.html));
};

module.exports = phpcopy;
