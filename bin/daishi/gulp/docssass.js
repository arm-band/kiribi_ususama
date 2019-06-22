const _         = require('../../../gulp/plugin')
const dir       = require('../../../gulp/dir')
const docsDir = './bin/docs/scss'

//scssコンパイルタスク
_.gulp.task('docs.sass', () => {
    return _.gulp.src([`${docsDir}/**/*.scss`, `!${docsDir}${dir.src.assets}/**/*.scss`, `!${dir.admin.scss}/**/*.scss`])
        .pipe(_.plumber())
        .pipe(_.sass({outputStyle: 'compressed'}).on('error', _.sass.logError))
        .pipe(_.autoprefixer({
            cascade: false
        }))
        .pipe(_.gulp.dest(dir.dist.css))
})

//上記をまとめておく
_.gulp.task('docs.scss', _.gulp.parallel('yaml2sass', 'docs.sass'))