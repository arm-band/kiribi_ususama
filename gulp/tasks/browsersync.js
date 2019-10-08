const _         = require('../plugin')
const dir       = require('../dir')
const functions = require('../functions')
const plugins = functions.getConfig(dir.config.plugins)

let GENERATENEWS
if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
    GENERATENEWS = 'ejs' //新着情報を含む全てのejsタスク
}
else {
    GENERATENEWS = 'newsless.ejs' //新着情報なしのejsタスク
}

//自動リロード
_.gulp.task('browsersync', () => {
    if(plugins.usephp && process.env.PHP_BIN && process.env.PHP_INI && process.env.PHP_PROXY) { //php使うときはこっち
        _.connect.server({
            port: 8001,
            base: dir.dist.html,
            bin: process.env.PHP_BIN,
            ini: process.env.PHP_INI
        }, () =>{
            _.browserSync({
                proxy: process.env.PHP_PROXY,
                open: 'external',
                https: plugins.ssl
            })
        })
    }
    else {
        _.browserSync({
            server: {
                baseDir: dir.dist.html
            },
            open: 'external',
            https: plugins.ssl
        })
    }

    _.watch(`${dir.src.ejs}/**/*.ejs`, _.gulp.series(GENERATENEWS, _.browserSync.reload))
    if(plugins.usephp) {
        _.watch(dir.src.php + '/**/*.php', _.gulp.series('phpcopy', _.browserSync.reload))
    }
    _.watch(`${dir.contents.dir}/**/*.md`, _.gulp.series('ejs', _.browserSync.reload))
    _.watch(`${dir.src.favicon}/**/*`, _.gulp.series('favicon', _.browserSync.reload))
    _.watch([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}/util/_var.scss`], _.gulp.series('sass', _.browserSync.reload))
    _.watch(`${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, _.gulp.series('imagemin', _.browserSync.reload))
    _.watch([`${dir.src.js}/**/*.js`, `!${dir.src.js}/concat/**/*.js`], _.gulp.series('js', _.browserSync.reload))
    _.watch([`${dir.config.dir}/**/*.yml`, `!${dir.config.dir}${dir.config.plugins}`], _.gulp.series(_.gulp.parallel(GENERATENEWS, 'scss', 'js'), _.browserSync.reload))
})