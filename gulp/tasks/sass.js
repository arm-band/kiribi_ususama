const _         = require("../plugin");
const dir       = require("../dir");
const scssParam = require("../scssParam");

//scssコンパイルタスク
_.gulp.task("yaml2sass", done => {
    let str = "$" + _.fs.readFileSync(dir.config.dir + dir.config.commonvar, { encoding: "UTF-8" }).replace(/(\r\n|\n)/g, ";\n$");
    str = str.replace(/\"/g, "");
    str = str + ";"; //最後だけ改行がないので;を付ける
    _.fs.writeFileSync(`${dir.src.scss}/util/_var.scss`, str);
    done();
});
//scssコンパイルタスク
_.gulp.task("sass", () => {
    return _.gulp.src([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}${dir.src.assets}/**/*.scss`])
        .pipe(_.plumber())
        .pipe(_.sass({outputStyle: "compressed"}).on("error", _.sass.logError))
        .pipe(_.autoprefixer({
            browsers: scssParam,
            cascade: false
        }))
        .pipe(_.gulp.dest(dir.dist.css));
});

//上記をまとめておく
_.gulp.task("scss", _.gulp.parallel("yaml2sass", "sass"));