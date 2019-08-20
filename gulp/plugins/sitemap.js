const _         = require('../plugin')
const dir       = require('../dir')
const functions = require('../functions')
const parameters = []

_.gulp.task('sitemap', () => {
    const config = functions.getConfig(dir.config.config)
    const commonVar = functions.getConfig(dir.config.commonvar)
    const plugins = functions.getConfig(dir.config.plugins)

    //リスト出力先の存在確認
    try {
        _.fs.statSync(dir.dist.html)
    } catch(err) {
        console.log(err)
        return false
    }
    let fileList = []
    //探索
    functions.htmlWalk(functions, dir.dist.html, fileList)
    //一覧生成
    let htmlList = ''
    const indexHtml = 'index.html'
    if(_.fs.statSync(`${dir.dist.html}/${indexHtml}`)){
        htmlList += `<li><a href="${indexHtml}">ホーム</a></li>\n`
    }
    for(let i = 0; i < fileList.length; i++) {
        const filepath = fileList[i][0].replace(/^\.\/dist\//gi, './')
        if(filepath !== `./${indexHtml}`) {
            const filename = fileList[i][1]
            htmlList += `<li><a href="${filepath}">${filename}</a></li>\n`
        }
    }

    return _.gulp.src(`${dir.plugins.ejs}/sitemap/sitemap.ejs`)
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { 'filename': file.path }
    }))
    .pipe(_.ejs({ config, commonVar, parameters, plugins, htmlList }))
    .pipe(_.rename({ extname: '.html' }))
    .pipe(_.gulp.dest(dir.dist.html))
})