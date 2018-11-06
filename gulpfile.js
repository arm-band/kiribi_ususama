/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */
/* require
*************************************** */
const _         = require("./gulp/plugin");
const dir       = require("./gulp/dir");
const scssParam = require("./gulp/scssParam");
const functions = require("./gulp/functions");
const gulpconfig = functions.getConfig(dir.config.gulpconfig);

let SYNCSERVER;
if(gulpconfig.usephp) {
    SYNCSERVER = "phpserver";
}
else {
    SYNCSERVER = "server";
}
let GENERATENEWS;
if(gulpconfig.news) {
    GENERATENEWS = "ejs"; //新着情報を含む全てのejsタスク
}
else {
    GENERATENEWS = "newsless.ejs"; //新着情報なしのejsタスク
}

/* requireDri Execution
*************************************** */
_.requireDir("./tasks", { recurse: true });

_.gulp.task("server", _.gulp.series("connect-sync"));
_.gulp.task("phpserver", _.gulp.series("php-sync"));
_.gulp.task("build", _.gulp.parallel(_.gulp.series("yaml2sass", "sass"), GENERATENEWS, "js", "imagemin", "favicon"));

//gulpのデフォルトタスクで諸々を動かす
_.gulp.task("default", _.gulp.series("build", SYNCSERVER));