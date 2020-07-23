const _         = require('../plugin');
const dir       = require('../dir');

//envfile
const envfile = () => {
    return _.gulp.src(
        [`${dir.src.envfile}/**/*`]
    )
    .pipe(_.plumber({
        errorHandler: _.notify.onError({
            message: 'Error: <%= error.message %>',
            title: 'envfile'
        })
    }))
    .pipe(_.rename({
        basename: ''
    }))
    .pipe(_.gulp.dest(dir.dist.html));
};

module.exports = envfile;
