const { src, dest, series, watch, lastRun } = require('gulp');
const plumber                               = require('gulp-plumber');
const notify                                = require('gulp-notify');
const frontnote                             = require('gulp-frontnote');
const imagemin                              = require('gulp-imagemin');
const imageminJpeg                          = require('imagemin-mozjpeg');
const imageminPng                           = require('imagemin-pngquant');
const imageminGif                           = require('imagemin-gifsicle');
const imageminSvg                           = require('imagemin-svgo');
const browserSync                           = require('browser-sync').create();
const dir                                   = require('../dir');
const functions                             = require('../functions');
const plugins                               = functions.getConfig(dir.config.plugins);
const scssTask                              = require('../tasks/sass');
const sass                                  = scssTask.sass;
const dirSg = {
    html       : './bin/styleguide/dist',
    md         : './readme.md',
    css        : '../../../dist/css',
    js         : '../../../dist/js',
    img        : './bin/styleguide/dist/img',
    favicon    : '../../../dist/favicon',
    canceller  : '../src/css',
    template   : './bin/styleguide/src/ejs'
};
const IMGDIR = { src: `${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, dist: dirSg.img };

//styleguide(FrontNote)
const sg = () => {
    return src(
        `${dir.src.scss}/**/*.scss`,
        {
            ignore: [
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/bootstrap.scss`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/bootstrap/**`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/honoka/**`
            ]
        }
    ) // 監視対象のファイルを指定
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'styleguide'
            })
        }))
        .pipe(frontnote({
            out: dirSg.html,
            title: functions.getConfig(dir.config.config).commons.sitename,
            css: [`${dirSg.css}/contents.css`, `${dirSg.css}/index.css`, `${dirSg.canceller}/fncanceller.css`],
            script: [`${dirSg.js}/lib.min.js`, `${dirSg.js}/app.min.js`],
            template: `${dirSg.template}/index.ejs`,
            overview: dirSg.md,
            params: { 'commonVar': functions.getConfig(dir.config.commonvar) }
        }));
};

//画像圧縮
const imageminify = () => {
    return src(IMGDIR.src, {
            since: lastRun(imageminify)
        })
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'imageminify'
            })
        }))
        .pipe(imagemin([
            imageminPng({
                quality: [.8, .9],
                speed: 1
            }),
            imageminJpeg({
                quality: 90
            }),
            imageminSvg(),
            imageminGif()
          ]))
        .pipe(dest(IMGDIR.dist));
};
//画像コピー(ファイルコピーのみ)
const imagecopy = () => {
    return src(IMGDIR.src)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'imagecopy'
            })
        }))
        .pipe(dest(IMGDIR.dist));
};

let imageProc = [];
if(plugins.imagemin) {
    imageProc.push(imageminify);
}
else {
    imageProc.push(imagecopy);
}

const sgsync = () => {
    const plugins = functions.getConfig(dir.config.plugins);
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: dirSg.html + '/index.html',
        open: 'external',
        https: plugins.ssl
    });

    const sScssSg = series(sass, sg, browserSync.reload);
    const sSg = series(sg, imageProc, browserSync.reload);
    watch(
        `${dirSg.template}/index.ejs`
    )
        .on('add',    sSg)
        .on('change', sSg)
        .on('unlink', sSg);
    watch(
        `${dirSg.md}`
    )
        .on('add',    sSg)
        .on('change', sSg)
        .on('unlink', sSg);
    watch(
        `${dir.src.scss}/**/*.scss`,
        {
            ignored: [
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/bootstrap.scss`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/bootstrap/**`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/honoka/**`
            ]
        }
    )
        .on('add',    sScssSg)
        .on('change', sScssSg)
        .on('unlink', sScssSg);
    watch(
        `${dirSg.js}/*.js`
    )
        .on('add',    sSg)
        .on('change', sSg)
        .on('unlink', sSg);
};

module.exports = series(sg, imageProc, sgsync);
