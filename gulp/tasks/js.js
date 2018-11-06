const _         = require("../plugin");
const dir       = require("../dir");

//js圧縮&結合&リネーム
_.gulp.task("js.concat", () => {
    return _.gulp.src([`${dir.assets.jquery}/jquery.min.js`, `${dir.assets.bootstrap}/bootstrap.bundle.min.js`, `${dir.assets.easing}/jquery.easing.js`, `${dir.assets.bowser}/bowser.js`])
        .pipe(_.plumber())
        .pipe(_.concat("lib.js"))
        .pipe(_.gulp.dest(`${dir.src.js}/concat/`)); //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
});
_.gulp.task("js.uglify.lib", _.gulp.series(_.gulp.parallel("js.concat"), () => { //第2引数に先に実行して欲しい js.concat を指定する
    return _.gulp.src(`${dir.src.js}/concat/lib.js`)
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: "some"}}))
        .pipe(_.rename(`${dir.dist.js}/lib.min.js`))  // 出力するファイル名を変更
        .pipe(_.gulp.dest("./"));
}));
_.gulp.task("js.uglify.app", () => {
    return _.gulp.src(`${dir.src.js}/index.js`)
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: "some"}}))
        .pipe(_.rename(`${dir.dist.js}/app.min.js`))
        .pipe(_.gulp.dest("./"));
});
//上記をまとめておく
_.gulp.task("js", _.gulp.parallel("js.uglify.lib", "js.uglify.app"));