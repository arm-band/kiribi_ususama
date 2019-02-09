const _         = require('../plugin')
const dir       = require('../dir')
const scssParam = require('../scssParam')

//scssコンパイルタスク
_.gulp.task('yaml2sass', done => {
    const strOrigin = _.fs.readFileSync(dir.config.dir + dir.config.commonvar, { encoding: 'UTF-8' })
    let strDist = ''
    let strArray = strOrigin.split("\n")
    for(let i = 0; i < strArray.length; i++) {
        if(!(i === strArray.length - 1 && strArray[i].length === 0)) { //最後の空行以外
            strDist += `$${strArray[i]};\n`
        }
    }
    strDist = strDist.replace(/\"/g, '')
    _.fs.writeFileSync(`${dir.src.scss}/util/_var.scss`, strDist)
    done()
})
//scssコンパイルタスク
_.gulp.task('sass', () => {
    return _.gulp.src([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}${dir.src.assets}/**/*.scss`, `!${dir.admin.scss}/**/*.scss`])
        .pipe(_.plumber())
        .pipe(_.sass({outputStyle: 'compressed'}).on('error', _.sass.logError))
        .pipe(_.autoprefixer({
            browsers: scssParam,
            cascade: false
        }))
        .pipe(_.gulp.dest(dir.dist.css))
})

//上記をまとめておく
_.gulp.task('scss', _.gulp.parallel('yaml2sass', 'sass'))