const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const plugins = functions.getConfig(dir.config.plugins);
const scssTask = require('../tasks/sass');
const sass = scssTask.sass;
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
    return _.gulp.src(
        `${dir.src.scss}/**/*.scss`,
        {
            ignore: [
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/bootstrap.scss`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/bootstrap/**`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/honoka/**`
            ]
        }
    ) // 監視対象のファイルを指定
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'styleguide'
            })
        }))
        .pipe(_.frontnote({
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

const sgsync = () => {
    const plugins = functions.getConfig(dir.config.plugins);
    _.browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: dirSg.html + '/index.html',
        open: 'external',
        https: plugins.ssl
    });

    const sScssSg = _.gulp.series(sass, sg, _.browserSync.reload);
    const sSg = _.gulp.series(sg, imageProc, _.browserSync.reload);
    _.gulp.watch(
        `${dirSg.template}/index.ejs`
    )
        .on('add',    sSg)
        .on('change', sSg)
        .on('unlink', sSg);
    _.gulp.watch(
        `${dirSg.md}`
    )
        .on('add',    sSg)
        .on('change', sSg)
        .on('unlink', sSg);
    _.gulp.watch(
        `${dir.src.scss}/**/*.scss`,
        {
            ignored: [
                `${dir.src.scss}/global/_var.scss`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/bootstrap.scss`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/bootstrap/**`,
                `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/honoka/**`
            ]
        }
    )
        .on('add',    sScssSg)
        .on('change', sScssSg)
        .on('unlink', sScssSg);
    _.gulp.watch(
        `${dirSg.js}/*.js`
    )
        .on('add',    sSg)
        .on('change', sSg)
        .on('unlink', sSg);
};

module.exports = _.gulp.series(sg, imageProc, sgsync);
