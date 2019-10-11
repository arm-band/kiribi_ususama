const _         = require('../plugin')
const dir       = require('../dir')
const functions = require('../functions')
const parameters = []
const configHtmlMin = {
    removeComments : true
}

//ejs
_.gulp.task('commons.ejs', () => {
    const config = functions.getConfig(dir.config.config)
    const commonVar = functions.getConfig(dir.config.commonvar)
    const plugins = functions.getConfig(dir.config.plugins)

    return _.gulp.src(
        [`${dir.src.ejs}/**/*.ejs`, `!${dir.src.ejs}/**/_*.ejs`, `!${dir.plugins.ejs}/**/*.ejs`, `!${dir.src.ejs}/**/index.ejs`, `!${dir.src.ejs}/news.ejs`, `!${dir.src.ejs}/article.ejs`] //_*.ejs(パーツ)とプラグインとindex,news,article(別タスクで定義)はhtmlにしない
    )
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { 'filename': file.path }
    }))
    .pipe(_.ejs({ config, commonVar, plugins, parameters }))
    .pipe(_.rename({ extname: '.html' }))
    .pipe(_.replace(/[\s\S]*?(<!DOCTYPE)/i, '$1'))
    .pipe(_.htmlmin(configHtmlMin))
    .pipe(_.gulp.dest(dir.dist.html))
})
//トップページ用のejsタスク
_.gulp.task('index.ejs', () => {
    const config = functions.getConfig(dir.config.config)
    const commonVar = functions.getConfig(dir.config.commonvar)
    const plugins = functions.getConfig(dir.config.plugins)
    let newsBlock = []
    let fileList = []
    if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
        fileList = functions.getArticles(`${dir.contents.dir}/`, functions)
        let newsLength = config.param.news.indexcount
        if(fileList.length <= config.param.news.indexcount || config.param.news.indexcount === 0) {
            newsLength = fileList.length
        }
        for(let i = 0; i < newsLength; i++) { //新着情報の件数
            const fileData = _.fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, 'utf8')
            const content = _.fm(fileData)
            const attributes = content.attributes
            newsBlock.push(attributes) //件数分スタック
        }
    }
    return _.gulp.src(`${dir.src.ejs}/index.ejs`)
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { 'filename': file.path }
    }))
    .pipe(_.ejs({ config, commonVar, plugins, newsBlock, parameters }))
    .pipe(_.rename({ extname: '.html' }))
    .pipe(_.replace(/[\s\S]*?(<!DOCTYPE)/i, '$1'))
    .pipe(_.htmlmin(configHtmlMin))
    .pipe(_.gulp.dest(dir.dist.html))
})
//新着情報専用のejsタスク
_.gulp.task('news.ejs', done => {
    const name = 'news' //テンプレート・生成するファイル名
    const config = functions.getConfig(dir.config.config)
    const commonVar = functions.getConfig(dir.config.commonvar)
    const plugins = functions.getConfig(dir.config.plugins)
    const defaultFile = `${dir.src.ejs}/article.ejs` //記事デフォルトテンプレート
    let tempArticleFile = defaultFile //記事テンプレート
    const tempNewsFile = `${dir.src.ejs}/${name}.ejs` //新着一覧テンプレート
    const fileList = functions.getArticles(`${dir.contents.dir}/`, functions)
    let pages = 1 //ページカウンタ
    let newsLength = config.param.news.newscount
    if(fileList.length <= config.param.news.newscount || config.param.news.newscount <= 0) {
        newsLength = fileList.length
    }
    const pageLength = Math.ceil(fileList.length / newsLength) //ページの最大数
    //RSS
    let feed
    if(plugins.rss) {
        feed = functions.rssFeed(config, functions)
    }
    let newsBlock = [] //1ページ辺りの記事のオブジェクト

    for(let i = 0; i < fileList.length; i++) { //新着情報の件数
        const fileData = _.fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, 'utf8')
        const content = _.fm(fileData)
        const attributes = content.attributes
        newsBlock.push(attributes) //件数分スタック
        /* 各記事ファイルを生成
        *************************************** */
        //テンプレートファイルの選択
        if(attributes.layout.length > 0) {
            tempArticleFile = `${dir.src.ejs}/${attributes.layout}`
        }
        else {
            tempArticleFile = `${dir.src.ejs}/article.ejs`
        }

        //記事生成
        const articleFileName = functions.articleURL(attributes, functions)
        const body = _.marked(content.body)
        _.gulp.src(tempArticleFile)
            .pipe(_.plumber())
            .pipe(_.data((ejsFile) => {
                return { 'filename': ejsFile.path }
            }))
            .pipe(_.ejs({ config, commonVar, plugins, attributes, body, name, pages, parameters }))
            .pipe(_.rename(`${articleFileName}.html`))
            .pipe(_.replace(/[\s\S]*?(<!DOCTYPE)/i, '$1'))
            .pipe(_.htmlmin(configHtmlMin))
            .pipe(_.gulp.dest(dir.dist.articles))

        //RSS
        if(plugins.rss) {
            if(config.param.news.indexcount === 0 || config.param.news.indexcount > i) { //件数はconfig.param.news.indexcountの件数とする(0件の場合は全て)
                functions.feedItem(feed, config, attributes, functions)
            }
        }

        if(i % config.param.news.newscount == (config.param.news.newscount - 1)) { //記事件数を1ページ当たりの件数で割った剰余が(1ページ当たりの件数-1)の場合はhtmlを生成
            _.gulp.src(tempNewsFile)
            .pipe(_.plumber())
            .pipe(_.data((file) => {
                return { 'filename': file.path }
            }))
            .pipe(_.ejs({ config, commonVar, plugins, newsBlock, name, pages, pageLength, parameters }))
            .pipe(_.rename(`${name}${pages}.html`))
            .pipe(_.replace(/[\s\S]*?(<!DOCTYPE)/i, '$1'))
            .pipe(_.htmlmin(configHtmlMin))
            .pipe(_.gulp.dest(dir.dist.news))

            newsBlock = [] //空にする
            pages++ //カウントアップ
        }
    }

    if(newsBlock.length > 0) {
        _.gulp.src(tempNewsFile)
        .pipe(_.plumber())
        .pipe(_.data((file) => {
            return { 'filename': file.path }
        }))
        .pipe(_.ejs({ config, commonVar, plugins, newsBlock, name, pages, pageLength, parameters }))
        .pipe(_.rename(`${name}${pages}.html`))
        .pipe(_.replace(/[\s\S]*?(<!DOCTYPE)/i, '$1'))
        .pipe(_.htmlmin(configHtmlMin))
        .pipe(_.gulp.dest(dir.dist.news))
    }

    //RSS
    if(plugins.rss) {
        const xml = feed.xml({indent: true})
        _.fs.writeFileSync(`${dir.dist.html}/rss.xml`, xml)
    }

    done()
})
//新着情報なしのejsタスク
_.gulp.task('newsless.ejs', () => {
    const config = functions.getConfig(dir.config.config)
    const commonVar = functions.getConfig(dir.config.commonvar)
    const plugins = functions.getConfig(dir.config.plugins)
    const newsBlock = []

    return _.gulp.src(
        [`${dir.src.ejs}/**/*.ejs`, `!${dir.src.ejs}/**/_*.ejs`, `!${dir.plugins.ejs}/**/*.ejs`, `!${dir.src.ejs}/news.ejs`, `!${dir.src.ejs}/article.ejs`] //_*.ejs(パーツ)とプラグインとindex,news,article(別タスクで定義)はhtmlにしない
    )
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { 'filename': file.path }
    }))
    .pipe(_.ejs({ config, commonVar, plugins, newsBlock, parameters }))
    .pipe(_.rename({ extname: '.html' }))
    .pipe(_.replace(/[\s\S]*?(<!DOCTYPE)/i, '$1'))
    .pipe(_.htmlmin(configHtmlMin))
    .pipe(_.gulp.dest(dir.dist.html))
})

//上記をまとめておく
_.gulp.task('ejs', _.gulp.parallel('commons.ejs', 'index.ejs', 'news.ejs'))