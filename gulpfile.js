/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */

var gulp = require("gulp");
//全般
var watch = require("gulp-watch");
var plumber = require("gulp-plumber"); //待機
var notify = require("gulp-notify"); //標準出力
//sass
var sass = require("gulp-sass"); //sass
var autoprefixer = require("gulp-autoprefixer");
var json2sass = require("gulp-json-to-sass"); //jsonからsassファイルを生成
//img
var imagemin = require("gulp-imagemin"); //画像ロスレス圧縮
//js
var uglify = require("gulp-uglify"); //js圧縮
var concat = require("gulp-concat"); //ファイル結合
var rename = require("gulp-rename"); //ファイル名変更
//ejs
var ejs = require("gulp-ejs");
var data = require("gulp-data"); //gulp-ejs内でファイル名を参照できるようにする
//file operation
var fs = require("fs");
//reload
var connect = require("gulp-connect-php"); //proxy(phpファイル更新時リロード用)
var browserSync = require("browser-sync"); //ブラウザリロード
//styleguide
var frontnote = require("gulp-frontnote");
//RSS
var RSS = require("rss");

//path difinition
var dir = {
  assets: {
    jquery    : './node_modules/jquery/dist',
    easing    : './node_modules/jquery.easing',
    bootstrap : './node_modules/bootstrap-honoka/dist/js',
    bowser    : './node_modules/bowser'
  },
  src: {
    ejs       : './src/ejs',
    scss      : './src/scss',
    js        : './src/js',
    img       : './src/img',
    favicon   : './src/favicon'
  },
  data: {
    dir       : './src/data',
    variables : '/variables.json',
    news      : '/news.json',
    commonvar : '/commonvar.json'
  },
  dist: {
    html      : './dist',
    news      : './dist/news',
    articles  : './dist/news/articles',
    css       : './dist/css',
    js        : './dist/js',
    img       : './dist/img'
  },
  sg: {
    html      : './sg/dist',
    md        : './readme.md',
    css       : '../../dist/css',
    js        : '../../dist/js',
    img       : '../../dist/img',
    favicon   : '../../dist/favicon',
    canceller : '../src/css',
    template  : './sg/src/ejs'
  }
};

//RSS Feed
var rssFeed = (variables) => {
    var day = new Date();
    var y = day.getFullYear();
    var m = day.getMonth() + 1;
    var d = day.getDate();
    var hr = day.getHours();
    var mt = day.getMinutes();
    var sc = day.getSeconds();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }

    var feed = new RSS({
        title: variables.commons.sitename,
        description: variables.param["index"].description,
        feed_url: variables.commons.url + "rss.xml",
        site_url: variables.commons.url,
        image_url: variables.commons.url + "img/" + variables.param["index"].ogpimage,
        managingEditor: variables.commons.author,
        webMaster: variables.commons.author,
        copyright: variables.commons.year + " " + variables.commons.author,
        language: "ja",
        pubDate: y + "-" + m + "-" + d + "T" + hr + ":" + mt + ":" + sc + "+09:00",
        ttl: "60"
    });

    return feed;
}
var feedItem = (feed, variables, newsBlock) => {
    var idTime = newsBlock.time.replace(/\//g, "");
    var version = newsBlock.title.replace(/\./g, "_");
    var articleIdStr = newsBlock.id + "_" + version + "-" + idTime;
    feed.item({
    title:  newsBlock.title,
    description: newsBlock.description,
    url: variables.commons.url.slice(0, -1) + variables.commons.baseurl + "news/articles/" + articleIdStr + ".html",
    author: variables.commons.author,
    date: newsBlock.time.replace(/\//g, "-")
});

    return feed;
}

//jsonファイル取得
//ejs内で使用するパラメータ
var getVariables = () => {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.variables, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}
//新着情報
var getNews = () => {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.news, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}
//ejs, js, scssにまたがって使用するパラメータ
var getCommonVar = () => {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.commonvar, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}

//scssコンパイルタスク
gulp.task("sass", () => {
    return gulp.src(`${dir.src.scss}/**/*.scss`)
        .pipe(plumber())
        .pipe(json2sass({
            jsonPath: `${dir.data.dir}${dir.data.commonvar}`,
            scssPath: `${dir.src.scss}/util/_var.scss`
        }))
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
            cascade: false
        }))
        .pipe(gulp.dest(dir.dist.css));
});

//画像圧縮
gulp.task("imagemin", () => {
    return gulp.src(`${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`)
        .pipe(imagemin())
        .pipe(gulp.dest(dir.dist.img));
});

//js圧縮&結合&リネーム
gulp.task("js.concat", () => {
    return gulp.src([`${dir.assets.jquery}/jquery.min.js`, `${dir.assets.bootstrap}/bootstrap.bundle.min.js`, `${dir.assets.easing}/jquery.easing.js`, `${dir.assets.bowser}/bowser.js`])
        .pipe(plumber())
        .pipe(concat("lib.js"))
        .pipe(gulp.dest(`${dir.src.js}/concat/`)); //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
});
gulp.task("js.uglify.lib", gulp.series(gulp.parallel("js.concat"), () => { //第2引数に先に実行して欲しい js.concat を指定する
    return gulp.src(`${dir.src.js}/concat/lib.js`)
        .pipe(plumber())
        .pipe(uglify({output: {comments: "some"}}))
        .pipe(rename(`${dir.dist.js}/lib.min.js`))  // 出力するファイル名を変更
        .pipe(gulp.dest("./"));
}));
gulp.task("js.uglify.app", () => {
    return gulp.src(`${dir.src.js}/index.js`)
        .pipe(plumber())
        .pipe(uglify({output: {comments: "some"}}))
        .pipe(rename(`${dir.dist.js}/app.min.js`))
        .pipe(gulp.dest("./"));
});
//上記をまとめておく
gulp.task("js", gulp.parallel("js.uglify.lib", "js.uglify.app"));

//ejs
gulp.task("commons.ejs", () => {
    var variables = getVariables();
    var newsjson = getNews();
    var commonVar = getCommonVar();
    return gulp.src(
        [`${dir.src.ejs}/**/*.ejs`, `!${dir.src.ejs}/**/_*.ejs`, `!${dir.src.ejs}/news.ejs`, `!${dir.src.ejs}/article.ejs`] //_*.ejs(パーツ)とnews.ejs(別タスクで定義)はhtmlにしない
    )
    .pipe(plumber())
    .pipe(data((file) => {
        return { "filename": file.path }
    }))
    .pipe(ejs({ variables, newsjson, commonVar }))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(dir.dist.html));
});

//新着情報専用のejsタスク
gulp.task("news.ejs", done => {
    var name = "news"; //テンプレート・生成するファイル名
    var variables = getVariables();
    var newsjson = getNews();
    var commonVar = getCommonVar();
    var tempFile = `${dir.src.ejs}/${name}.ejs`; //テンプレート
    var pages = 1; //ページカウンタ
    var pageLength = Math.ceil(newsjson.news.length / newsjson.pagination); //ページの最大数
    var newsBlock = []; //1ページ辺りの記事のオブジェクト

    for(var i = 0; i < newsjson.news.length; i++) { //新着情報の件数
        newsBlock.push(newsjson.news[i]); //件数分スタック

        if(i % newsjson.pagination == (newsjson.pagination - 1)) { //記事件数を1ページ当たりの件数で割った剰余が(1ページ当たりの件数-1)の場合はhtmlを生成
            gulp.src(tempFile)
            .pipe(plumber())
            .pipe(data((file) => {
                return { "filename": file.path }
            }))
            .pipe(ejs({ variables, newsBlock, commonVar, name, pages, pageLength }))
            .pipe(rename(`${name}${pages}.html`))
            .pipe(gulp.dest(dir.dist.news));

            newsBlock = []; //空にする
            pages++; //カウントアップ
        }
    }

    if(newsBlock.length > 0) {
        gulp.src(tempFile)
        .pipe(plumber())
        .pipe(data((file) => {
            return { "filename": file.path }
        }))
        .pipe(ejs({ variables, newsBlock, commonVar, name, pages, pageLength }))
        .pipe(rename(`${name}${pages}.html`))
        .pipe(gulp.dest(dir.dist.news));
    }

    done();
});

//記事専用のejsタスク
gulp.task("article.ejs", done => {
    var name = "news"; //テンプレート・生成するファイル名
    var variables = getVariables();
    var newsjson = getNews();
    var commonVar = getCommonVar();
    var tempFile = `${dir.src.ejs}/article.ejs`; //テンプレート
    var pages = 1; //ページカウンタ
    var feed = rssFeed(variables); //RSS

    for(var i = 0; i < newsjson.news.length; i++) { //新着情報の件数
        var newsBlock = newsjson.news[i];
        var idTime = newsBlock.time.replace(/\//g, "");
        var version = newsBlock.title.replace(/\./g, "_");
        gulp.src(tempFile)
        .pipe(plumber())
        .pipe(data((file) => {
            return { "filename": file.path }
        }))
        .pipe(ejs({ variables, newsBlock, commonVar, name, pages }))
        .pipe(rename(`${newsBlock.id}_${version}-${idTime}.html`))
        .pipe(gulp.dest(dir.dist.articles));

        if(variables.param["index"].newscount > i) { //件数はvariables.param["index"].newscountの件数とする
            feedItem(feed, variables, newsBlock); //RSS
        }

        if(i % newsjson.pagination == (newsjson.pagination - 1)) { //記事件数を1ページ当たりの件数で割った剰余が(1ページ当たりの件数-1)の場合はhtmlを生成
            pages++; //カウントアップ
        }
    }

    var xml = feed.xml({indent: true}); //RSS
    fs.writeFile(`${dir.dist.html}/rss.xml`, xml, (err) => {
        if (err) {
            throw err;
        }
    });

    done();
});
//上記をまとめておく
gulp.task("ejs", gulp.parallel("commons.ejs", "news.ejs", "article.ejs"));

//favicon
gulp.task("favicon", () => {
    return gulp.src(
        [`${dir.src.favicon}/**/*`]
    )
    .pipe(plumber())
    .pipe(gulp.dest(dir.dist.html));
});

//自動リロード
gulp.task("connect-sync", () => {
/*  connect.server({ //php使うときはこっち
        port: 8001,
        base: dir.dist.html,
        bin: "D:/xampp/php/php.exe",
        ini: "D:/xampp/php/php.ini"
    }, () =>{
        browserSync({
            proxy: "localhost:8001",
            open: 'external'
        });
    });*/
    browserSync({
        server: {
            baseDir: dir.dist.html
        },
        open: 'external'
    });

    watch(`${dir.src.ejs}/**/*.ejs`, gulp.series("ejs", browserSync.reload));
//    watch(dir.dist.html + "/**/*.php", gulp.series(browserSync.reload)); //php使うときはこっち
    watch(`${dir.src.favicon}/**/*`, gulp.series("favicon", browserSync.reload));
    watch([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}/util/_var.scss`], gulp.series("sass", browserSync.reload));
    watch(`${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, gulp.series("imagemin", browserSync.reload));
    watch(`${dir.src.js}/*.js`, gulp.series("js", browserSync.reload));
    watch(`${dir.data.dir}/**/*.json`, gulp.series(gulp.parallel("ejs", "sass", "js"), browserSync.reload));
});

//styleguide(FrontNote)
gulp.task("styleguide", () => {
    return gulp.src(dir.src.scss + "/**/*.scss") // 監視対象のファイルを指定
        .pipe(frontnote({
            out: dir.sg.html,
            title: getVariables().commons.sitename,
            css: [`${dir.sg.css}/contents.css`, `${dir.sg.css}/index.css`, `${dir.sg.canceller}/fncanceller.css`, "https://fonts.googleapis.com/css?family=Dancing+Script", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"],
            script: [`${dir.sg.js}/lib.min.js`, `${dir.sg.js}/app.min.js`],
            template: `${dir.sg.template}/index.ejs`,
            overview: dir.sg.md,
            params: { "commonVar": getCommonVar() }
        }));
});

gulp.task("server", gulp.series("connect-sync"));
gulp.task("build", gulp.parallel("sass", "ejs", "js", "imagemin", "favicon"));

//gulpのデフォルトタスクで諸々を動かす
gulp.task("default", gulp.series("build", "server"));