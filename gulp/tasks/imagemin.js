const { src, dest, lastRun, parallel } = require('gulp');
const plumber                          = require('gulp-plumber');
const notify                           = require('gulp-notify');
const imagemin                         = require('gulp-imagemin');
const imageminJpeg                     = require('imagemin-mozjpeg');
const imageminPng                      = require('imagemin-pngquant');
const imageminGif                      = require('imagemin-gifsicle');
const imageminSvg                      = require('imagemin-svgo');
const dir                              = require('../dir');
const functions                        = require('../functions');
const plugins = functions.getConfig(dir.config.plugins);
const IMGDIR = { src: `${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, dist: dir.dist.img };

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

//コールタスク
module.exports = parallel(imageProc);
