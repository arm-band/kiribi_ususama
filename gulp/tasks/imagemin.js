const _         = require('../plugin')
const dir       = require('../dir')
const functions = require('../functions')
const plugins = functions.getConfig(dir.config.plugins)
const IMGDIR = { src: `${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, dist: dir.dist.img }
const IMGPROC = { MINIFY: 'imageminify', COPY: 'imagecopy' }

//フラグで画像に対する処理を分岐
let IMAGEPROC
if(plugins.imagemin) {
    IMAGEPROC = IMGPROC.MINIFY
}
else {
    IMAGEPROC = IMGPROC.COPY
}

//画像圧縮
_.gulp.task(IMGPROC.MINIFY, () => {
    return _.gulp.src(IMGDIR.src)
        .pipe(_.imagemin([
            _.imageminPng({
                quality: 90,
                speed: 1
            }),
            _.imageminJpeg({
                quality: 90
            }),
            _.imageminSvg(),
            _.imageminGif()
          ]))
        .pipe(_.gulp.dest(IMGDIR.dist))
})
//画像コピー(ファイルコピーのみ)
_.gulp.task(IMGPROC.COPY, () => {
    return _.gulp.src(IMGDIR.src)
    .pipe(_.plumber())
    .pipe(_.gulp.dest(IMGDIR.dist))
})

//コールタスク
_.gulp.task('imagemin', _.gulp.parallel(IMAGEPROC))