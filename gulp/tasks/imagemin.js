const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const plugins = functions.getConfig(dir.config.plugins);
const IMGDIR = { src: `${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, dist: dir.dist.img };

//画像圧縮
const imageminify = () => {
    return _.gulp.src(IMGDIR.src, {
            since: _.gulp.lastRun(imageminify)
        })
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'imageminify'
            })
        }))
        .pipe(_.imagemin([
            _.imageminPng({
                quality: [.8, .9],
                speed: 1
            }),
            _.imageminJpeg({
                quality: 90
            }),
            _.imageminSvg(),
            _.imageminGif()
          ]))
        .pipe(_.gulp.dest(IMGDIR.dist));
};
//画像コピー(ファイルコピーのみ)
const imagecopy = () => {
    return _.gulp.src(IMGDIR.src)
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'imagecopy'
            })
        }))
        .pipe(_.gulp.dest(IMGDIR.dist));
};

let imageProc = [];
if(plugins.imagemin) {
    imageProc.push(imageminify);
}
else {
    imageProc.push(imagecopy);
}

//コールタスク
module.exports = _.gulp.parallel(imageProc);
