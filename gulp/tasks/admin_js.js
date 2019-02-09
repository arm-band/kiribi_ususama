const _         = require('../plugin')
const dir       = require('../dir')

//js
_.gulp.task('admin.js.concat', () => {
    return _.gulp.src([`${dir.assets.jquery}/jquery.min.js`, `${dir.assets.bootstrap}/bootstrap.bundle.min.js`, `${dir.assets.easing}/jquery.easing.js`])
        .pipe(_.plumber())
        .pipe(_.concat('lib.js'))
        .pipe(_.gulp.dest(`${dir.admin.js}/concat/`)) //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
})
_.gulp.task('admin.js.lib', _.gulp.series(_.gulp.parallel('admin.js.concat'), () => { //第2引数に先に実行して欲しい js.concat を指定する
    return _.gulp.src(`${dir.admin.js}/concat/lib.js`)
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: 'some'}}))
        .pipe(_.rename(`${dir.admin.dist}${dir.admin.distjs}/lib.min.js`))  // 出力するファイル名を変更
        .pipe(_.gulp.dest('./'))
}))
_.gulp.task('admin.js.app', () => {
    return _.gulp.src(`${dir.admin.js}/index.js`)
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: 'some'}}))
        .pipe(_.rename(`${dir.admin.dist}${dir.admin.distjs}/app.min.js`))
        .pipe(_.gulp.dest('./'))
})
//上記をまとめておく
_.gulp.task('admin.js', _.gulp.parallel('admin.js.lib', 'admin.js.app'))