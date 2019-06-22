const _         = require('../plugin')
const dir       = require('../dir')

//js圧縮&結合&リネーム
_.gulp.task('js.concat', () => {
    return _.gulp.src([`${dir.assets.jquery}/jquery.min.js`, `${dir.assets.bootstrap}/bootstrap.bundle.min.js`, `${dir.assets.easing}/jquery.easing.js`, `${dir.assets.bowser}/bundled.js`])
        .pipe(_.plumber())
        .pipe(_.concat('lib.js'))
        .pipe(_.gulp.dest(`${dir.src.js}/concat/`)) //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
})
_.gulp.task('js.uglify', _.gulp.series(_.gulp.parallel('js.concat'), () => {
    return _.gulp.src(`${dir.src.js}/**/*.js`)
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: 'some'}}))
        .pipe(_.rename((path) => {
            path.dirname = dir.dist.js
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(_.gulp.dest('./'))
}))
//上記をまとめておく
_.gulp.task('js', _.gulp.parallel('js.uglify'))