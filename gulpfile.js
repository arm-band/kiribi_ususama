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
//img
var imagemin = require("gulp-imagemin"); //画像ロスレス圧縮
//js
var uglify = require("gulp-uglify"); //js圧縮
var concat = require("gulp-concat"); //ファイル結合
var rename = require("gulp-rename"); //ファイル名変更
//ejs
var ejs = require("gulp-ejs");
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
    jquery   : './node_modules/jquery/dist',
    easing   : './node_modules/jquery.easing',
    bootstrap: './node_modules/bootstrap-honoka/dist/js'
  },
  src: {
    ejs  : './src/ejs',
    scss : './src/scss',
    js   : './src/js',
    img  : './src/img'
  },
  dist: {
    html : './dist',
    css  : './dist/css',
    js   : './dist/js',
    img  : './dist/img'
  },
  docs: {
    html : './docs',
    css  : '../dist/css',
    js   : '../dist/js',
    img  : '../dist/img'
  }
};
//jsonファイル取得
var getCommons = function() {
    return JSON.parse(fs.readFileSync("src/ejs/common/var.json"));
}
var getNews = function() {
    return JSON.parse(fs.readFileSync("src/ejs/news/news.json"));
}

//scssコンパイルタスク
gulp.task("sass", () => {
	return gulp.src(dir.src.scss + "/**/*.scss")
		.pipe(plumber())
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
    var commons = getCommons();
    var newsjson = getNews();
    gulp.src(
        [dir.src.ejs + "/**/*.ejs", "!" + dir.src.ejs + "/**/_*.ejs"] //_*.ejsはhtmlにしない
    )
    .pipe(plumber())
    .pipe(ejs({commons, newsjson}))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(dir.dist.html));
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

//styleguide
gulp.task("styleguide", () => {
    gulp.src(dir.src.scss + "/**/*.scss") // 監視対象のファイルを指定
        .pipe(frontnote({
            out: dir.docs.html,
            title: getCommons().commons.sitename,
            css: [dir.docs.css + "/index.css", "http://fonts.googleapis.com/css?family=Dancing+Script", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"],
            js: dir.docs.js + "/index.js"
        }));
});

//gulpのみでsass-watchとejsとjsとimageminとconnect-syncを動かす
gulp.task("default", ["sass", "sass-watch", "ejs", "js", "imagemin", "connect-sync", "styleguide"], () => {
	gulp.watch(dir.src.ejs + "/**/*.ejs",["ejs"]);
    gulp.watch(dir.src.ejs + "/**/*.json",["ejs"]);
//    gulp.watch(dir.dist.html + "/**/*.php",function () { browserSync.reload(); }); //php使うときはこっち
    gulp.watch(dir.src.scss + "/**/*.scss",["sass-watch", "styleguide"]);
	gulp.watch(dir.src.img + "/**/*.+(jpg|jpeg|png|gif|svg)",["imagemin"]);
	gulp.watch(dir.src.js + "/**/*.js",["js"]);

    gulp.watch([dir.dist.html + "/**/*.+(html|php)", dir.dist.css + "/**/*.css", dir.dist.img + "/**/*.+(jpg|jpeg|png|gif|svg)", dir.dist.js + "/**/*.js"]).on("change", () => { browserSync.reload(); });
});