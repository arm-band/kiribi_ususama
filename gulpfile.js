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
const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;

let SYNCSERVER;
if(gulpConfig.usephp) {
    SYNCSERVER = "phpsync";
}
else {
    SYNCSERVER = "browsersync";
}
let GENERATENEWS;
if(gulpConfig.news) {
    GENERATENEWS = "ejs"; //新着情報を含む全てのejsタスク
}
else {
    GENERATENEWS = "newsless.ejs"; //新着情報なしのejsタスク
}

/* requireDri Execution
*************************************** */
_.requireDir("./tasks", { recurse: true });

_.gulp.task("init", _.gulp.series("admin.ejs", "admin.sass", "admin.js.lib", "admin.browsersync"));

_.gulp.task("server", _.gulp.series(SYNCSERVER));
_.gulp.task("build", _.gulp.parallel(_.gulp.series("yaml2sass", "sass"), GENERATENEWS, "js", "imagemin", "favicon"));

//gulpのデフォルトタスクで諸々を動かす
_.gulp.task("default", _.gulp.series("build", "server"));