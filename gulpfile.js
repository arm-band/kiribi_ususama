/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */
/* require
*************************************** */
const _         = require('./gulp/plugin')
const dir       = require('./gulp/dir')
const functions = require('./gulp/functions')
const plugins = functions.getConfig(dir.config.plugins)

let GENERATENEWS
if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
    GENERATENEWS = 'ejs' //新着情報を含む全てのejsタスク
}
else {
    GENERATENEWS = 'newsless.ejs' //新着情報なしのejsタスク
}

/* requireDri Execution
*************************************** */
_.requireDir('./tasks', { recurse: true })
_.requireDir('./plugins', { recurse: true })
_.requireDir('./../bin/daishi/gulp', { recurse: true })

_.gulp.task('daishi', _.gulp.series('admin.sass', 'admin.js'))

_.gulp.task('server', _.gulp.series('browsersync'))
if(plugins.usephp) {
    _.gulp.task('build', _.gulp.parallel('scss', GENERATENEWS, 'phpcopy', 'js', 'imagemin', 'favicon'))
}
else {
    _.gulp.task('build', _.gulp.parallel('scss', GENERATENEWS, 'js', 'imagemin', 'favicon'))
}

//ビルドなし
_.gulp.task('view', _.gulp.series('server'))
//gulpのデフォルトタスクで諸々を動かす
_.gulp.task('default', _.gulp.series('build', 'server'))