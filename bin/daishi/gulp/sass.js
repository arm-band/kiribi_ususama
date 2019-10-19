const _         = require('../../../gulp/plugin');
const dir       = require('../../../gulp/dir');

//scss
const adminSass = () => {
    return _.gulp.src(`${dir.admin.dir}${dir.admin.scss}/**/*.scss`)
        .pipe(_.plumber())
        .pipe(_.sass({outputStyle: 'compressed'}).on('error', _.sass.logError))
        .pipe(_.autoprefixer({
            cascade: false
        }))
        .pipe(_.gulp.dest(`${dir.admin.dir}${dir.admin.css}`));
};

module.exports = adminSass;