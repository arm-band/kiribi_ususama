const _         = require('../plugin')
const dir       = require('../dir')
const functions = require('../functions')
const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions

let GENERATENEWS
if(gulpConfig.news) {
    GENERATENEWS = 'ejs' //新着情報を含む全てのejsタスク
}
else {
    GENERATENEWS = 'newsless.ejs' //新着情報なしのejsタスク
}

const htmlPager = '_htmlPager.html'

const htmlWalk = (p, fileList) => {
    let files = _.fs.readdirSync(p)

    for(let i = 0; i < files.length; i++) {
        let path = p
        if(!/.*\/$/.test(p)) {
            path += '/'
        }
        const fp = path + files[i]
        if(_.fs.statSync(fp).isDirectory()) {
            if(fp.indexOf('daishi') === -1) {
                htmlWalk(fp, fileList) //daishiディレクトリ以外のディレクトリなら再帰
            }
        } else {
            if(/.*\.html$/.test(fp)) {
                fileList.push(fp) //HTMLファイルならコールバック発動
            }
        }
    }
}
_.gulp.task('getHTML', done => {
    //リスト出力先の存在確認
    try {
        _.fs.statSync(dir.admin.dist)
    } catch(err) {
        console.log(err)
        return false
    }

    let fileList = []
    //探索
    htmlWalk(dir.dist.html, fileList)

    //一覧生成
    let htmlList = ''
    for(let i = 0; i < fileList.length; i++) {
        const filepath = fileList[i].replace(/^\.\/dist\//gi, '../')
        const filename = fileList[i].replace(/^\.\/dist\//gi, '')
        htmlList += `       <li><a href="${filepath}">${filename}</a></li>\n`
    }

    //データ生成
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>HTML List</title>
</head>
<body>
    <h1>HTML List</h1>
    <h2>Top Page</h2>
    <p><a href="../">Home</a></p>
    <h2>Counter</h2>
    <p>Totals: ${fileList.length} pages</p>
    <h2>Page List</h2>
    <ul>
        ${htmlList}
    </ul>
</body>
</html>`

    //書き込み
    let path = dir.admin.dist
    if(!/.*\/$/.test(path)) {
        path += '/'
    }
    _.fs.writeFileSync(path + htmlPager, html)
    done()
})
//生成
_.gulp.task('hpager', _.gulp.series('getHTML', () => {
    let path = `daishi/${htmlPager}`
    if(!/.*\/$/.test(dir.dist.html)) {
        path = '/' + path
    }

    _.browserSync({
        server: {
            baseDir: dir.dist.html
        },
        startPath: path,
        open: 'external',
        https: gulpConfig.ssl
    })

    _.watch(`${dir.src.ejs}/**/*.ejs`, _.gulp.series(GENERATENEWS, 'getHTML', _.browserSync.reload))
    _.watch(`${dir.contents.dir}/**/*.md`, _.gulp.series('ejs', 'getHTML', _.browserSync.reload))
    _.watch(`${dir.src.favicon}/**/*`, _.gulp.series('favicon', 'getHTML', _.browserSync.reload))
    _.watch([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}/util/_var.scss`], _.gulp.series('sass', 'getHTML', _.browserSync.reload))
    _.watch(`${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, _.gulp.series('imagemin', 'getHTML', _.browserSync.reload))
    _.watch(`${dir.src.js}/*.js`, _.gulp.series('js', 'getHTML', _.browserSync.reload))
    _.watch([`${dir.config.dir}/**/*.yml`, `!${dir.config.dir}/gulpconfig.yml`], _.gulp.series(_.gulp.parallel(GENERATENEWS, 'scss', 'js'), 'getHTML', _.browserSync.reload))
}))