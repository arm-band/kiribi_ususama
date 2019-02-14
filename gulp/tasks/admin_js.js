const _         = require('../plugin')
const dir       = require('../dir')

//js
_.gulp.task('admin.js.concat', () => {
    return _.gulp.src([`${dir.assets.jquery}/jquery.min.js`, `${dir.assets.bootstrap}/bootstrap.bundle.min.js`, `${dir.assets.easing}/jquery.easing.js`])
        .pipe(_.plumber())
        .pipe(_.concat('lib.js'))
        .pipe(_.gulp.dest(`${dir.admin.js}/concat/`)) //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
})
_.gulp.task('admin.js.uglify', _.gulp.series(_.gulp.parallel('admin.js.concat'), () => {
    return _.gulp.src(`${dir.admin.js}/**/*.js`)
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: 'some'}}))
        .pipe(_.rename((path) => {
            path.dirname = `${dir.admin.dist}${dir.admin.distjs}`
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(_.gulp.dest('./'))
}))
//上記をまとめておく
_.gulp.task('admin.js', _.gulp.parallel('admin.js.uglify'))