const _         = require("../plugin");
const dir       = require("../dir");

//画像圧縮
_.gulp.task("imagemin", () => {
    return _.gulp.src(`${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`)
        .pipe(_.imagemin())
        .pipe(_.gulp.dest(dir.dist.img));
});