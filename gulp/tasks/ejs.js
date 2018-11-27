const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");

//ejs
_.gulp.task("commons.ejs", () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;

    return _.gulp.src(
        [`${dir.src.ejs}/**/*.ejs`, `!${dir.src.ejs}/**/_*.ejs`, `!${dir.src.ejs}/**/index.ejs`, `!${dir.src.ejs}/news.ejs`, `!${dir.src.ejs}/article.ejs`] //_*.ejs(パーツ)とindex,news,article(別タスクで定義)はhtmlにしない
    )
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { "filename": file.path }
    }))
    .pipe(_.ejs({ config, commonVar, gulpConfig }))
    .pipe(_.rename({ extname: ".html" }))
    .pipe(_.gulp.dest(dir.dist.html));
});
//トップページ用のejsタスク
_.gulp.task("index.ejs", () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;
    const fileList = functions.getArticles(`${dir.contents.dir}/`, functions);
    let newsBlock = [];
    let newsLength = config.param.indexcount;
    if(fileList.length <= config.param.indexcount || config.param.indexcount <= 0) {
        newsLength = fileList.length;
    }
    for(let i = 0; i < newsLength; i++) { //新着情報の件数
        const fileData = _.fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, "utf8");
        const content = _.fm(fileData);
        const attributes = content.attributes;
        newsBlock.push(attributes); //件数分スタック
    }
    return _.gulp.src(`${dir.src.ejs}/index.ejs`)
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { "filename": file.path }
    }))
    .pipe(_.ejs({ config, commonVar, gulpConfig, newsBlock }))
    .pipe(_.rename({ extname: ".html" }))
    .pipe(_.gulp.dest(dir.dist.html));
});
//新着情報専用のejsタスク
_.gulp.task("news.ejs", done => {
    const name = "news"; //テンプレート・生成するファイル名
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;
    const defaultFile = `${dir.src.ejs}/article.ejs`; //記事デフォルトテンプレート
    let tempArticleFile = defaultFile; //記事テンプレート
    const tempNewsFile = `${dir.src.ejs}/${name}.ejs`; //新着一覧テンプレート
    const fileList = functions.getArticles(`${dir.contents.dir}/`, functions);
    let pages = 1; //ページカウンタ
    let newsLength = config.param.newscount;
    if(fileList.length <= config.param.newscount || config.param.newscount <= 0) {
        newsLength = fileList.length;
    }
    const pageLength = Math.ceil(fileList.length / newsLength); //ページの最大数
    let feed = functions.rssFeed(config, functions); //RSS
    let newsBlock = []; //1ページ辺りの記事のオブジェクト

    for(let i = 0; i < fileList.length; i++) { //新着情報の件数
        const fileData = _.fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, "utf8");
        const content = _.fm(fileData);
        const attributes = content.attributes;
        newsBlock.push(attributes); //件数分スタック
        /* 各記事ファイルを生成
        *************************************** */
        //テンプレートファイルの選択
        if(attributes.layout.length > 0) {
            tempArticleFile = `${dir.src.ejs}/${attributes.layout}`;
        }
        else {
            tempArticleFile = `${dir.src.ejs}/article.ejs`;
        }

        //記事生成
        const articleFileName = functions.articleURL(attributes, functions);
        const body = _.marked(content.body);
        _.gulp.src(tempArticleFile)
            .pipe(_.plumber())
            .pipe(_.data((ejsFile) => {
                return { "filename": ejsFile.path }
            }))
            .pipe(_.ejs({ config, commonVar, gulpConfig, attributes, body, name, pages }))
            .pipe(_.rename(`${articleFileName}.html`))
            .pipe(_.gulp.dest(dir.dist.articles));

        if(config.param.indexcount > i) { //件数はconfig.param.indexcountの件数とする
            functions.feedItem(feed, config, attributes, functions); //RSS
        }

        if(i % config.param.newscount == (config.param.newscount - 1)) { //記事件数を1ページ当たりの件数で割った剰余が(1ページ当たりの件数-1)の場合はhtmlを生成
            _.gulp.src(tempNewsFile)
            .pipe(_.plumber())
            .pipe(_.data((file) => {
                return { "filename": file.path }
            }))
            .pipe(_.ejs({ config, commonVar, gulpConfig, newsBlock, name, pages, pageLength }))
            .pipe(_.rename(`${name}${pages}.html`))
            .pipe(_.gulp.dest(dir.dist.news));

            newsBlock = []; //空にする
            pages++; //カウントアップ
        }
    }

    if(newsBlock.length > 0) {
        _.gulp.src(tempNewsFile)
        .pipe(_.plumber())
        .pipe(_.data((file) => {
            return { "filename": file.path }
        }))
        .pipe(_.ejs({ config, commonVar, gulpConfig, newsBlock, name, pages, pageLength }))
        .pipe(_.rename(`${name}${pages}.html`))
        .pipe(_.gulp.dest(dir.dist.news));
    }

    //RSS
    const xml = feed.xml({indent: true});
    _.fs.writeFileSync(`${dir.dist.html}/rss.xml`, xml);

    done();
});
//新着情報なしのejsタスク
_.gulp.task("newsless.ejs", () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;

    return _.gulp.src(
        [`${dir.src.ejs}/**/*.ejs`, `!${dir.src.ejs}/**/_*.ejs`, `!${dir.src.ejs}/news.ejs`, `!${dir.src.ejs}/article.ejs`] //_*.ejs(パーツ)とindex,news,article(別タスクで定義)はhtmlにしない
    )
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { "filename": file.path }
    }))
    .pipe(_.ejs({ config, commonVar, gulpConfig }))
    .pipe(_.rename({ extname: ".html" }))
    .pipe(_.gulp.dest(dir.dist.html));
});

//上記をまとめておく
_.gulp.task("ejs", _.gulp.parallel("commons.ejs", "index.ejs", "news.ejs"));