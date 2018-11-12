const _         = require("../plugin");
const dir       = require("../dir");
const scssParam = require("../scssParam");

//scss
_.gulp.task("admin.sass", () => {
    return _.gulp.src(`${dir.src.scss}/assets/bootstrap/bootstrap.scss`)
        .pipe(_.plumber())
        .pipe(_.sass({outputStyle: "compressed"}).on("error", _.sass.logError))
        .pipe(_.autoprefixer({
            browsers: scssParam,
            cascade: false
        }))
        .pipe(_.gulp.dest("./admin/css"));
});