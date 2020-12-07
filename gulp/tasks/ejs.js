const { src, dest, parallel } = require('gulp');
const plumber                 = require('gulp-plumber');
const notify                  = require('gulp-notify');
const rename                  = require('gulp-rename');
const ejs                     = require('gulp-ejs');
const data                    = require('gulp-data');
const replace                 = require('gulp-replace');
const htmlmin                 = require('gulp-htmlmin');
const fs                      = require('fs');
const marked                  = require('marked');
const fm                      = require('front-matter');
const dir                     = require('../dir');
const functions               = require('../functions');
const jsConfig                = require('../jsconfig');
const dotenv                  = require('dotenv').config();
const plugins = functions.getConfig(dir.config.plugins);
const nowDate = functions.formatDate('', 'nodelimiter');
const parameters = [];

//ejs
const commonsEjs = () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const plugins = functions.getConfig(dir.config.plugins);
    const DEV_MODE = process.env.DEV_MODE;

    return src(
        `${dir.src.ejs}/**/*.ejs`,
        {
            ignore: [
                `${dir.src.ejs}/**/_*.ejs`,
                `${dir.plugins.ejs}/**`,
                `${dir.src.ejs}/index.ejs`,
                `${dir.src.ejs}/news.ejs`,
                `${dir.src.ejs}/article.ejs`
            ] //_*.ejs(パーツ)とプラグインとindex,news,article(別タスクで定義)はhtmlにしない
        })
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'commonsEjs'
            })
        }))
        .pipe(data((file) => {
            return { 'filename': file.path }
        }))
        .pipe(ejs({ config, commonVar, plugins, parameters, nowDate, DEV_MODE }))
        .pipe(rename({ extname: '.html' }))
        .pipe(htmlmin(jsConfig.configHtmlMin))
        .pipe(replace(jsConfig.htmlSpaceLineDel, ''))
        .pipe(dest(dir.dist.html));
};
//トップページ用のejsタスク
const indexEjs = () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const plugins = functions.getConfig(dir.config.plugins);
    const DEV_MODE = process.env.DEV_MODE;
    let newsBlock = [];
    let fileList = [];
    if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
        fileList = functions.getArticles(`${dir.contents.dir}/`, functions);
        let newsLength = config.param.news.indexcount;
        if(fileList.length <= config.param.news.indexcount || config.param.news.indexcount === 0) {
            newsLength = fileList.length;
        }
        for(let i = 0; i < newsLength; i++) { //新着情報の件数
            const fileData = fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, 'utf8');
            const content = fm(fileData);
            const attributes = content.attributes;
            newsBlock.push(attributes); //件数分スタック
        }
    }
    return src(`${dir.src.ejs}/index.ejs`)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'indexEjs'
            })
        }))
        .pipe(data((file) => {
            return { 'filename': file.path }
        }))
        .pipe(ejs({ config, commonVar, plugins, newsBlock, parameters, nowDate, DEV_MODE }))
        .pipe(rename({ extname: '.html' }))
        .pipe(htmlmin(jsConfig.configHtmlMin))
        .pipe(replace(jsConfig.htmlSpaceLineDel, ''))
        .pipe(dest(dir.dist.html));
};
//新着情報専用のejsタスク
const newsEjs = (done) => {
    const name = 'news'; //テンプレート・生成するファイル名
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const plugins = functions.getConfig(dir.config.plugins);
    const DEV_MODE = process.env.DEV_MODE;
    const defaultFile = `${dir.src.ejs}/article.ejs`; //記事デフォルトテンプレート
    let tempArticleFile = defaultFile; //記事テンプレート
    const tempNewsFile = `${dir.src.ejs}/${name}.ejs`; //新着一覧テンプレート
    const fileList = functions.getArticles(`${dir.contents.dir}/`, functions);
    let pages = 1; //ページカウンタ
    let newsLength = config.param.news.newscount;
    if(fileList.length <= config.param.news.newscount || config.param.news.newscount <= 0) {
        newsLength = fileList.length;
    }
    const pageLength = Math.ceil(fileList.length / newsLength); //ページの最大数
    //RSS
    let feed;
    if(plugins.rss) {
        feed = functions.rssFeed(config, functions);
    }
    let newsBlock = []; //1ページ辺りの記事のオブジェクト

    for(let i = 0; i < fileList.length; i++) { //新着情報の件数
        const fileData = fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, 'utf8');
        const content = fm(fileData);
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
        const body = marked(content.body, {
            headerIds: false
        });
        src(tempArticleFile)
            .pipe(plumber({
                errorHandler: notify.onError({
                    message: 'Error: <%= error.message %>',
                    title: 'newsEjs: article page'
                })
            }))
            .pipe(data((ejsFile) => {
                return { 'filename': ejsFile.path }
            }))
            .pipe(ejs({ config, commonVar, plugins, attributes, body, name, pages, parameters, nowDate, DEV_MODE }))
            .pipe(rename(`${articleFileName}.html`))
            .pipe(htmlmin(jsConfig.configHtmlMin))
            .pipe(replace(jsConfig.htmlSpaceLineDel, ''))
            .pipe(dest(dir.dist.articles));

        //RSS
        if(plugins.rss) {
            if(config.param.news.indexcount === 0 || config.param.news.indexcount > i) { //件数はconfig.param.news.indexcountの件数とする(0件の場合は全て)
                functions.feedItem(feed, config, attributes, functions);
            }
        }

        if(i % config.param.news.newscount == (config.param.news.newscount - 1)) { //記事件数を1ページ当たりの件数で割った剰余が(1ページ当たりの件数-1)の場合はhtmlを生成
            src(tempNewsFile)
                .pipe(plumber({
                    errorHandler: notify.onError({
                        message: 'Error: <%= error.message %>',
                        title: 'newsEjs: news page'
                    })
                }))
                .pipe(data((file) => {
                    return { 'filename': file.path }
                }))
                .pipe(ejs({ config, commonVar, plugins, newsBlock, name, pages, pageLength, parameters, nowDate, DEV_MODE }))
                .pipe(rename(`${name}${pages}.html`))
                .pipe(htmlmin(jsConfig.configHtmlMin))
                .pipe(replace(jsConfig.htmlSpaceLineDel, ''))
                .pipe(dest(dir.dist.news));

            newsBlock = []; //空にする
            pages++; //カウントアップ
        }
    }

    if(newsBlock.length > 0) {
        src(tempNewsFile)
            .pipe(plumber({
                errorHandler: notify.onError({
                    message: 'Error: <%= error.message %>',
                    title: 'newsEjs: last page'
                })
            }))
            .pipe(data((file) => {
                return { 'filename': file.path }
            }))
            .pipe(ejs({ config, commonVar, plugins, newsBlock, name, pages, pageLength, parameters, nowDate, DEV_MODE }))
            .pipe(rename(`${name}${pages}.html`))
            .pipe(htmlmin(jsConfig.configHtmlMin))
            .pipe(replace(jsConfig.htmlSpaceLineDel, ''))
            .pipe(dest(dir.dist.news));
    }

    //RSS
    if(plugins.rss) {
        const xml = feed.xml({indent: true});
        fs.writeFileSync(`${dir.dist.html}/rss.xml`, xml);
    }

    done();
};
//新着情報なしのejsタスク
const newslessEjs = () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const plugins = functions.getConfig(dir.config.plugins);
    const DEV_MODE = process.env.DEV_MODE;
    const newsBlock = [];

    return src(
        `${dir.src.ejs}/**/*.ejs`,
        {
            ignore: [
                `${dir.src.ejs}/**/_*.ejs`,
                `${dir.plugins.ejs}/**`,
                `${dir.src.ejs}/news.ejs`,
                `${dir.src.ejs}/article.ejs`
            ] //_*.ejs(パーツ)とプラグインとindex,news,article(別タスクで定義)はhtmlにしない
        })
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'newslessEjs'
            })
        }))
        .pipe(data((file) => {
            return { 'filename': file.path }
        }))
        .pipe(ejs({ config, commonVar, plugins, newsBlock, parameters, nowDate, DEV_MODE }))
        .pipe(rename({ extname: '.html' }))
        .pipe(htmlmin(jsConfig.configHtmlMin))
        .pipe(replace(jsConfig.htmlSpaceLineDel, ''))
        .pipe(dest(dir.dist.html));
};

let ejsArray = [];
if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
    ejsArray.push(commonsEjs, indexEjs, newsEjs); //新着情報を含む全てのejsタスク
}
else {
    ejsArray.push(newslessEjs); //新着情報なしのejsタスク
}

//上記をまとめておく
module.exports = parallel(ejsArray);
