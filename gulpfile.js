/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */

var gulp = require("gulp");
//全般
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

//path difinition
var dir = {
  assets: {
    jquery    : './node_modules/jquery/dist',
    easing    : './node_modules/jquery.easing',
    bootstrap : './node_modules/bootstrap-honoka/dist/js'
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
    css       : './dist/css',
    js        : './dist/js',
    img       : './dist/img',
    favicon   : './dist/favicon'
  },
  docs: {
    html      : './docs',
    css       : '../dist/css',
    js        : '../dist/js',
    img       : '../dist/img',
    favicon   : '../dist/favicon',
    canceller : '../misc/frontenote/css',
    template  : './misc/frontenote/ejs'
  }
};
//jsonファイル取得
//ejs内で使用するパラメータ
var getVariables = function() {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.variables));
}
var getNews = function() {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.news));
}
//ejs, js, scssにまたがって使用するパラメータ
var getCommonVar = function() {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.commonvar));
}

//scssコンパイルタスク
gulp.task("sass", () => {
	return gulp.src(dir.src.scss + "/**/*.scss")
		.pipe(plumber())
        .pipe(json2sass({
            jsonPath: dir.data.dir + dir.data.commonvar,
            scssPath: dir.src.scss + "/base/_var.scss"
        }))
		.pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
            cascade: false
        }))
		.pipe(gulp.dest(dir.dist.css));
});
//watchタスク(Sassファイル変更時に実行するタスク)
gulp.task("sass-watch", () => {
	gulp.watch(dir.src.scss + "/**/*.scss", ["sass"]);
});

//画像圧縮
gulp.task("imagemin", () => {
	gulp.src(dir.src.img + "/**/*.+(jpg|jpeg|png|gif|svg)")
		.pipe(imagemin())
		.pipe(gulp.dest(dir.dist.img));
});

//js圧縮&結合&リネーム
gulp.task("js.concat", () => {
	return gulp.src([dir.assets.jquery + "/jquery.min.js", dir.assets.bootstrap + "/bootstrap.min.js", dir.assets.easing + "/jquery.easing.js"])
		.pipe(plumber())
		.pipe(concat("lib.js"))
		.pipe(gulp.dest(dir.src.js + "/concat/")); //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
});
gulp.task("js.uglify", ["js.concat"], () => { //第2引数に先に実行して欲しい js.concat を指定する
	return gulp.src(dir.src.js + "/concat/lib.js")
		.pipe(plumber())
		.pipe(uglify({output: {comments: "some"}}))
		.pipe(rename(dir.dist.js + "/lib.min.js"))  // 出力するファイル名を変更
		.pipe(gulp.dest("./"));
});
gulp.task("js.uglify.progress", () => {
	return gulp.src(dir.src.js + "/progress.js")
		.pipe(plumber())
		.pipe(uglify({output: {comments: "some"}}))
		.pipe(rename(dir.dist.js + "/progress.min.js"))
		.pipe(gulp.dest("./"));
});
gulp.task("js.uglify.app", () => {
	return gulp.src(dir.src.js + "/index.js")
		.pipe(plumber())
		.pipe(uglify({output: {comments: "some"}}))
		.pipe(rename(dir.dist.js + "/app.min.js"))
		.pipe(gulp.dest("./"));
});
//上記をまとめておく
gulp.task("js", ["js.concat", "js.uglify", "js.uglify.progress", "js.uglify.app"]);

//ejs
gulp.task("ejs", () => {
    var variables = getVariables();
    var newsjson = getNews();
    var commonVar = getCommonVar();
    gulp.src(
        [dir.src.ejs + "/**/*.ejs", "!" + dir.src.ejs + "/**/_*.ejs", "!" + dir.src.ejs + "/news.ejs"] //_*.ejs(パーツ)とnews.ejs(別タスクで定義)はhtmlにしない
    )
    .pipe(plumber())
    .pipe(data(function(file) {
        return { "filename": file.path }
    }))
    .pipe(ejs({ variables, newsjson, commonVar }))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(dir.dist.html));
});

//新着情報専用のejaタスク
gulp.task("news.ejs", function() {
    var name = "news"; //テンプレート・生成するファイル名
    var variables = getVariables();
    var newsjson = getNews();
    var commonVar = getCommonVar();
    var tempFile = dir.src.ejs + "/" + name + ".ejs"; //テンプレート
    var pages = 1; //ページカウンタ
    var count = 0; //記事件数カウンタ
    var pageLength = Math.ceil(newsjson.news.length / newsjson.pagination); //ページの最大数
    var newsBlock = []; //1ページ辺りの記事のオブジェクト

    for(var i = 0; i < newsjson.news.length; i++) { //新着情報の件数
        newsBlock.push(newsjson.news[i]); //件数分スタック

        if(i % newsjson.pagination == (newsjson.pagination - 1)) { //記事件数を1ページ当たりの件数で割った剰余が(1ページ当たりの件数-1)の場合はhtmlを生成
            gulp.src(tempFile)
            .pipe(plumber())
            .pipe(data(function(file) {
                return { "filename": file.path }
            }))
            .pipe(ejs({ variables, newsBlock, commonVar, name, pages, pageLength }))
            .pipe(rename(name + pages + ".html"))
            .pipe(gulp.dest(dir.dist.news));

            newsBlock = []; //空にする
            pages++; //カウントアップ
        }
    }

    if(newsBlock.length > 0) {
        gulp.src(tempFile)
        .pipe(plumber())
        .pipe(data(function(file) {
            return { "filename": file.path }
        }))
        .pipe(ejs({ variables, newsBlock, commonVar, name, pages, pageLength }))
        .pipe(rename(name + pages + ".html"))
        .pipe(gulp.dest(dir.dist.news));
    }
});

//favicon
gulp.task("favicon", () => {
    gulp.src(
        [dir.src.favicon + "/**/*"]
    )
    .pipe(plumber())
    .pipe(gulp.dest(dir.dist.favicon));
});

//proxy経由
gulp.task("connect-sync", () => {
/*	connect.server({ //php使うときはこっち
		port: 8001,
		base: dir.dist.html,
		bin: "D:/xampp/php/php.exe",
		ini: "D:/xampp/php/php.ini"
	}, function (){
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
});

//styleguide(FrontNote)
gulp.task("styleguide", () => {
    gulp.src(dir.src.scss + "/**/*.scss") // 監視対象のファイルを指定
        .pipe(frontnote({
            out: dir.docs.html,
            title: getVariables().commons.sitename,
            css: [dir.docs.css + "/index.css", dir.docs.canceller + "/fncanceller.css", "https://fonts.googleapis.com/css?family=Dancing+Script", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"],
            script: [dir.docs.js + "/lib.min.js", dir.docs.js + "/app.min.js"]
        }));
});

//gulpのみでsass-watchとejsとjsとimageminとconnect-syncを動かす
gulp.task("default", ["sass-watch", "ejs", "news.ejs", "js", "imagemin", "favicon", "connect-sync", "styleguide"], () => {
	gulp.watch(dir.src.ejs + "/**/*.ejs", ["ejs", "news.ejs"]);
//    gulp.watch(dir.dist.html + "/**/*.php",function () { browserSync.reload(); }); //php使うときはこっち
    gulp.watch(dir.src.scss + "/**/*.scss", ["sass", "styleguide"]);
	gulp.watch(dir.src.img + "/**/*.+(jpg|jpeg|png|gif|svg)", ["imagemin"]);
	gulp.watch(dir.src.js + "/**/*.js", ["js"]);
    gulp.watch(dir.data.dir + "/**/*.json", ["ejs", "news.ejs", "sass", "js", "styleguide"]);

    gulp.watch([dir.dist.html + "/**/*.+(html|php)", dir.dist.css + "/**/*.css", dir.dist.img + "/**/*.+(jpg|jpeg|png|gif|svg)", dir.dist.js + "/**/*.js"]).on("change", () => { browserSync.reload(); });
});