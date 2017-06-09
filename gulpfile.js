var gulp = require("gulp");

//全般
var plumber = require("gulp-plumber"); //待機
var notify = require("gulp-notify"); //標準出力
//sass
var sass = require("gulp-ruby-sass"); //sass
//img
var imagemin = require("gulp-imagemin"); //画像ロスレス圧縮
//js
var uglify = require("gulp-uglify"); //js圧縮
var concat = require("gulp-concat"); //ファイル結合
var rename = require("gulp-rename"); //ファイル名変更
//ejs
var ejs = require("gulp-ejs");
//reload
var connect = require("gulp-connect-php"); //proxy(phpファイル更新時リロード用)
var browserSync = require("browser-sync"); //ブラウザリロード

//path difinition
var dir = {
  assets: {
    jquery   : './node_modules/jquery/dist',
    easing   : './node_modules/jquery-easing/dist',
    bootstrap: './node_modules/Honoka/dist/js'
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
  }
};

//scssコンパイルタスク
gulp.task("sass", function() {
	var errorMessage = "Error: <%= error.message %>";
	var sassOptions = {
		style : "compressed"
	}

	return sass([dir.src.scss + "/**/*.scss"], sassOptions)
	.pipe(plumber({
		errorHandler: notify.onError( errorMessage )
	}))
	.pipe(gulp.dest(dir.dist.css));
});

//watchタスク(Sassファイル変更時に実行するタスク)
gulp.task("sass-watch", ["sass"], function(){
	var watcher = gulp.watch(dir.src.scss + "/**/*.scss", ["sass"]);
	watcher.on("change", function(event) {
		console.log("File " + event.path + " was " + event.type + ", running tasks..."); //ログ出力
	});
});

//画像圧縮
gulp.task("imagemin", function(){
	gulp.src(dir.src.img + "/**/*.+(jpg|jpeg|png|gif|svg)")
		.pipe(imagemin())
		.pipe(gulp.dest(dir.dist.img));
});

//js圧縮&結合&リネーム
gulp.task("js.concat", function() {
	return gulp.src([dir.assets.jquery + "/jquery.min.js", dir.assets.bootstrap + "/bootstrap.min.js", dir.assets.easing + "/jquery.easing.1.3.umd.min.js"])
		.pipe(plumber())
		.pipe(concat("lib.js"))
		.pipe(gulp.dest(dir.src.js + "/concat/")); //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
});
gulp.task("js.uglify", ["js.concat"], function() { //第2引数に先に実行して欲しい js.concat を指定する
	return gulp.src(dir.src.js + "/concat/lib.js")
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: "some" // ! から始まるコメントを残すオプションを追加
		}))
		.pipe(rename(dir.dist.js + "/lib.min.js"))  // 出力するファイル名を変更
		.pipe(gulp.dest("./"));
});
gulp.task("js.uglify.progress", function() {
	return gulp.src(dir.src.js + "/progress.js")
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: "some"
		}))
		.pipe(rename(dir.dist.js + "/progress.min.js"))
		.pipe(gulp.dest("./"));
});
gulp.task("js.uglify.app", function() {
	return gulp.src(dir.src.js + "/index.js")
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: "some"
		}))
		.pipe(rename(dir.dist.js + "/app.min.js"))
		.pipe(gulp.dest("./"));
});
//上記をまとめておく
gulp.task("js", ["js.concat", "js.uglify", "js.uglify.progress", "js.uglify.app"]);

//ejs
gulp.task("ejs", function() {
    gulp.src(
        [dir.src.ejs + "/**/*.ejs", "!" + dir.src.ejs + "/**/_*.ejs"] //_*.ejsはhtmlにしない
    )
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(dir.dist.html));
});

//proxy経由
gulp.task("connect-sync", function() {
/*	connect.server({ //php使うときはこっち
		port: 8001,
		base: dir.dist.html,
		bin: "D:/xampp/php/php.exe",
		ini: "D:/xampp/php/php.ini"
	}, function (){
		browserSync({
			proxy: "localhost:8001"
		});
	});*/
    browserSync({
        server: {
            baseDir: dir.dist.html
        }
    });
});

//リロード
gulp.task("reload", function(){
	browserSync.reload();
});

//gulpのみでsass-watchとejsとjsとimageminとconnect-syncを動かす
gulp.task("default", ["sass-watch", "ejs", "js", "imagemin", "connect-sync"], function() {
	gulp.watch(dir.src.ejs + "/**/*.ejs",["ejs"]);
    gulp.watch([dir.dist + "/**/*.html"]).on("change", browserSync.reload);
//	gulp.watch("./dist/**/*.php",["reload"]); //php使うときはこっち

    gulp.watch(dir.src.scss + "/**/*.scss",["sass-watch"]);
    gulp.watch([dir.dist.css + "/**/*.css"]).on("change", browserSync.reload);

	gulp.watch(dir.src.img + "/**/*.+(jpg|jpeg|png|gif|svg)",["imagemin"]);
    gulp.watch([dir.dist.img + "/**/*.+(jpg|jpeg|png|gif|svg)"]).on("change", browserSync.reload);

	gulp.watch(dir.src.js + "/**/*.js",["js"]);
    gulp.watch([dir.dist.js + "/**/*.js"]).on("change", browserSync.reload);
});