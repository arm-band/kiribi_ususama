/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */

const gulp = require("gulp");
//全般
const watch = require("gulp-watch");
const plumber = require("gulp-plumber"); //待機
const notify = require("gulp-notify"); //標準出力
//sass
const sass = require("gulp-sass"); //sass
const autoprefixer = require("gulp-autoprefixer");
//img
const imagemin = require("gulp-imagemin"); //画像ロスレス圧縮
//js
const uglify = require("gulp-uglify"); //js圧縮
const concat = require("gulp-concat"); //ファイル結合
const rename = require("gulp-rename"); //ファイル名変更
//ejs
const ejs = require("gulp-ejs");
const data = require("gulp-data"); //gulp-ejs内でファイル名を参照できるようにする
//file operation
const fs = require("fs");
//reload
const connect = require("gulp-connect-php"); //proxy(phpファイル更新時リロード用)
const browserSync = require("browser-sync"); //ブラウザリロード
//styleguide
const frontnote = require("gulp-frontnote");
//RSS
const RSS = require("rss");
//yaml
const yaml = require("yaml").default;
//marked
const marked = require("marked");
//front-matter
const fm = require("front-matter");

//path difinition
const dir = {
  assets: {
    jquery    : './node_modules/jquery/dist',
    easing    : './node_modules/jquery.easing',
    bootstrap : './node_modules/bootstrap-honoka/dist/js',
    bowser    : './node_modules/bowser'
  },
  src: {
    ejs       : './src/ejs',
    scss      : './src/scss',
    assets    : '/assets',
    js        : './src/js',
    img       : './src/img',
    favicon   : './src/favicon'
  },
  config: {
    dir       : './src/config',
    config    : '/config.yml',
    commonvar : '/commonvar.yml'
  },
  contents: {
    dir       : './src/contents'
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
//scss compile parameters
const scssParam = [
    'last 2 version',
    'iOS >= 10.0',
    'Android >= 5.0'
];

//RSS Feed
const rssFeed = (config) => {
    const datetime = formatDate("", "");

    const feed = new RSS({
        title: config.commons.sitename,
        description: config.commons.description,
        feed_url: config.commons.url + "rss.xml",
        site_url: config.commons.url,
        image_url: config.commons.url + config.commons.ogpimage,
        managingEditor: config.commons.author,
        webMaster: config.commons.author,
        copyright: config.commons.year + " " + config.commons.author,
        language: "ja",
        pubDate: datetime,
        ttl: "60"
    });

    return feed;
}
const feedItem = (feed, config, attributes) => {
    feed.item({
        title:  attributes.title,
        description: attributes.excerpt,
        url: config.commons.url + "news/articles/" + articleURL(attributes) + ".html",
        author: config.commons.author,
        date: String(attributes.date)
    });
    return feed;
}

//yamlファイル取得
const getConfig = () => {
    const file = fs.readFileSync(dir.config.dir + dir.config.config, "utf8");
    return yaml.parse(file);
}
const getCommonVar = () => {
    const file = fs.readFileSync(dir.config.dir + dir.config.commonvar, "utf8");
    return yaml.parse(file);
}

//記事一覧をファイル名降順で取得
const getArticles = (directory) => {
    let fileList = fs.readdirSync(directory);
    //ファイル名(拡張子なし)でソート
    fileList = fileList.map(fn => {
        return {
            fn: fn,
            noex: zeroPadding(parseInt(fn.split('.')[0]))
        }
    });
    return fileList.sort((a, b) => b.noex - a.noex);
}
//記事ページのURLを生成
const articleURL = (attributes) => {
    let urlTitle = attributes.title;
    urlTitle = urlTitle.replace(/\./g, "_");
    const datetime = formatDate(attributes.date, "ymd");
    const url = `releasenote_${urlTitle}-${datetime}`;
    return url;
}
//記事一覧を数字で管理すると桁数が異なるときに人間的な順番と機械的な順番が異なってしまうのを防ぐためにゼロパディング
const zeroPadding = (num) => {
    const val = Math.abs(num); //絶対値に変換
    const length = val.toString().length; //文字列に変換して長さを取得、桁数とする
    return (Array(length).join("0") + num).slice(-length);
}
//日付のフォーマット
const formatDate = (dateObj, output) => {
    let day;
    if(String(dateObj).length > 0) {
        day = new Date(dateObj);
    }
    else {
        day = new Date();
    }
    const y = day.getFullYear();
    let m = day.getMonth() + 1;
    let d = day.getDate();
    const hr = day.getHours();
    const mt = day.getMinutes();
    const sc = day.getSeconds();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }

    let datetime;
    if(output === "ymd") {
        datetime = `${y}${m}${d}`;
    }
    else {
        datetime = y + "-" + m + "-" + d + "T" + hr + ":" + mt + ":" + sc + "+09:00"
    }

    return datetime;
}

//scssコンパイルタスク
gulp.task("yaml2sass", done => {
    let str = "$" + fs.readFileSync(dir.config.dir + dir.config.commonvar, { encoding: "UTF-8" }).replace(/\n/g, ";\n$");
    str = str.replace(/\"/g, "");
    str = str + ";"; //最後だけ改行がないので;を付ける
    fs.writeFileSync(`${dir.src.scss}/util/_var.scss`, str);
    done();
});
//scssコンパイルタスク
gulp.task("sass", () => {
    return gulp.src([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}${dir.src.assets}/**/*.scss`])
        .pipe(plumber())
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: scssParam,
            cascade: false
        }))
        .pipe(gulp.dest(dir.dist.css));
});

//上記をまとめておく
gulp.task("scss", gulp.parallel("yaml2sass", "sass"));

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
    const config = getConfig();
    const commonVar = getCommonVar();
    const fileList = getArticles(`${dir.contents.dir}/`);
    let newsBlock = [];
    const newsLength = config.param.indexcount;
    if(fileList.length <= config.param.indexcount) {
        newsLength = fileList.length;
    }
    for(let i = 0; i < newsLength; i++) { //新着情報の件数
        const fileData = fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, "utf8");
        const content = fm(fileData);
        const attributes = content.attributes;
        newsBlock.push(attributes); //件数分スタック
    }
    return gulp.src(
        [`${dir.src.ejs}/**/*.ejs`, `!${dir.src.ejs}/**/_*.ejs`, `!${dir.src.ejs}/news.ejs`, `!${dir.src.ejs}/article.ejs`] //_*.ejs(パーツ)とnews.ejs(別タスクで定義)はhtmlにしない
    )
    .pipe(plumber())
    .pipe(data((file) => {
        return { "filename": file.path }
    }))
    .pipe(ejs({ config, newsBlock, commonVar }))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(dir.dist.html));
});

//新着情報専用のejsタスク
gulp.task("news.ejs", done => {
    const name = "news"; //テンプレート・生成するファイル名
    const config = getConfig();
    const commonVar = getCommonVar();
    const defaultFile = `${dir.src.ejs}/article.ejs`; //記事デフォルトテンプレート
    let tempArticleFile = defaultFile; //記事テンプレート
    const tempNewsFile = `${dir.src.ejs}/${name}.ejs`; //新着一覧テンプレート
    const fileList = getArticles(`${dir.contents.dir}/`);
    let pages = 1; //ページカウンタ
    const pageLength = Math.ceil(fileList.length / config.param.newscount); //ページの最大数
    let feed = rssFeed(config); //RSS
    let newsBlock = []; //1ページ辺りの記事のオブジェクト

    for(let i = 0; i < fileList.length; i++) { //新着情報の件数
        const fileData = fs.readFileSync(`${dir.contents.dir}/${fileList[i].fn}`, "utf8");
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
        const body = marked(content.body);
        gulp.src(tempArticleFile)
            .pipe(plumber())
            .pipe(data((ejsFile) => {
                return { "filename": ejsFile.path }
            }))
            .pipe(ejs({ config, attributes, body, commonVar, name, pages }))
            .pipe(rename(`${articleURL(attributes)}.html`))
            .pipe(gulp.dest(dir.dist.articles));

        if(config.param.indexcount > i) { //件数はconfig.param.indexcountの件数とする
            feedItem(feed, config, attributes); //RSS
        }

        if(i % config.param.newscount == (config.param.newscount - 1)) { //記事件数を1ページ当たりの件数で割った剰余が(1ページ当たりの件数-1)の場合はhtmlを生成
            gulp.src(tempNewsFile)
            .pipe(plumber())
            .pipe(data((file) => {
                return { "filename": file.path }
            }))
            .pipe(ejs({ config, newsBlock, commonVar, name, pages, pageLength }))
            .pipe(rename(`${name}${pages}.html`))
            .pipe(gulp.dest(dir.dist.news));

            newsBlock = []; //空にする
            pages++; //カウントアップ
        }
    }

    if(newsBlock.length > 0) {
        gulp.src(tempNewsFile)
        .pipe(plumber())
        .pipe(data((file) => {
            return { "filename": file.path }
        }))
        .pipe(ejs({ config, newsBlock, commonVar, name, pages, pageLength }))
        .pipe(rename(`${name}${pages}.html`))
        .pipe(gulp.dest(dir.dist.news));
    }

    //RSS
    const xml = feed.xml({indent: true});
    fs.writeFileSync(`${dir.dist.html}/rss.xml`, xml);

    done();
});

//上記をまとめておく
gulp.task("ejs", gulp.parallel("commons.ejs", "news.ejs"));

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
    watch(`${dir.contents.dir}/**/*.md`, gulp.series("ejs", browserSync.reload));
//    watch(dir.dist.html + "/**/*.php", gulp.series(browserSync.reload)); //php使うときはこっち
    watch(`${dir.src.favicon}/**/*`, gulp.series("favicon", browserSync.reload));
    watch([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}/util/_var.scss`], gulp.series("sass", browserSync.reload));
    watch(`${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, gulp.series("imagemin", browserSync.reload));
    watch(`${dir.src.js}/*.js`, gulp.series("js", browserSync.reload));
    watch([`${dir.config.dir}/**/*.yml`], gulp.series(gulp.parallel("ejs", "scss", "js"), browserSync.reload));
});

//styleguide(FrontNote)
gulp.task("styleguide", () => {
    return gulp.src(dir.src.scss + "/**/*.scss") // 監視対象のファイルを指定
        .pipe(frontnote({
            out: dir.sg.html,
            title: getConfig().commons.sitename,
            css: [`${dir.sg.css}/contents.css`, `${dir.sg.css}/index.css`, `${dir.sg.canceller}/fncanceller.css`, "https://fonts.googleapis.com/css?family=Dancing+Script", "https://fonts.googleapis.com/earlyaccess/sawarabimincho.css", "https://use.fontawesome.com/releases/v5.2.0/css/all.css"],
            script: [`${dir.sg.js}/lib.min.js`, `${dir.sg.js}/app.min.js`],
            template: `${dir.sg.template}/index.ejs`,
            overview: dir.sg.md,
            params: { "commonVar": getCommonVar() }
        }));
});

gulp.task("server", gulp.series("connect-sync"));
gulp.task("build", gulp.parallel(gulp.series("yaml2sass", "sass"), "ejs", "js", "imagemin", "favicon"));

//gulpのデフォルトタスクで諸々を動かす
gulp.task("default", gulp.series("build", "server"));