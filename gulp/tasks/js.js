const _         = require('../plugin')
const dir       = require('../dir')
const functions = require('../functions')
const plugins = functions.getConfig(dir.config.plugins)

//js圧縮&結合&リネーム
_.gulp.task('js.concat', () => {
    let libSrcArray = [`${dir.assets.jquery}/jquery.min.js`, `${dir.assets.bootstrap}/bootstrap.bundle.min.js`, `${dir.assets.easing}/jquery.easing.js`]
    if(plugins.safari) {
        libSrcArray.push(`${dir.assets.bowser}/bundled.js`)
    }
    if(plugins.lightbox) {
        libSrcArray.push(`${dir.assets.lightbox}/js/lightbox.js`)
    }
    if(plugins.slick) {
        libSrcArray.push(`${dir.assets.slick}/slick.js`)
    }
    libSrcArray.push(`${dir.src.js}/_plugins/_plugins.js`)

    return _.gulp.src(libSrcArray)
        .pipe(_.plumber())
        .pipe(_.concat('lib.js'))
        .pipe(_.gulp.dest(`${dir.src.js}/concat/`)) //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
})
_.gulp.task('js', _.gulp.series(_.gulp.parallel('js.concat'), () => {
    return _.gulp.src([`${dir.src.js}/**/*.js`, `!${dir.src.js}/_plugins/**/*.js`])
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: 'some'}}))
        .pipe(_.rename((path) => {
            path.dirname = dir.dist.js
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(_.gulp.dest('./'))
}))