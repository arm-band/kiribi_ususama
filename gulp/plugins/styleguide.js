const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const scssTask = require('../tasks/sass');
const sass = scssTask.sass;
const dirSg = {
    html       : './bin/styleguide/dist',
    md         : './readme.md',
    css        : '../../../dist/css',
    js         : '../../../dist/js',
    img        : '../../../dist/img',
    favicon    : '../../../dist/favicon',
    canceller  : '../src/css',
    template   : './bin/styleguide/src/ejs'
};

//styleguide(FrontNote)
const sg = () => {
    return _.gulp.src(dir.src.scss + '/**/*.scss') // 監視対象のファイルを指定
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'styleguide'
            })
        }))
        .pipe(_.frontnote({
            out: dirSg.html,
            title: functions.getConfig(dir.config.config).commons.sitename,
            css: [`${dirSg.css}/contents.css`, `${dirSg.css}/index.css`, `${dirSg.canceller}/fncanceller.css`, 'https://use.fontawesome.com/releases/v5.2.0/css/all.css'],
            script: [`${dirSg.js}/lib.min.js`, `${dirSg.js}/app.min.js`],
            template: `${dirSg.template}/index.ejs`,
            overview: dirSg.md,
            params: { 'commonVar': functions.getConfig(dir.config.commonvar) }
        }));
};

const sgsync = () => {
    const plugins = functions.getConfig(dir.config.plugins);
    _.browserSync({
        server: {
            baseDir: './'
        },
        startPath: dirSg.html + '/index.html',
        open: 'external',
        https: plugins.ssl
    });

    const sReload = _.gulp.series(_.browserSync.reload);
    _.gulp.watch(
        `${dirSg.template}/index.ejs`
    )
        .on('add',    sReload)
        .on('change', sReload)
        .on('unlink', sReload);
    _.gulp.watch(
        `${dirSg.md}`
    )
        .on('add',    sReload)
        .on('change', sReload)
        .on('unlink', sReload);
    const sSg = _.gulp.series(sass, sg, _.browserSync.reload);
    _.gulp.watch(
        `${dir.src.scss}/_plugins/styleguide/*.scss`,

    )
        .on('add',    sSg)
        .on('change', sSg)
        .on('unlink', sSg);
    _.gulp.watch(
        `${dirSg.js}/*.js`
    )
        .on('add',    sReload)
        .on('change', sReload)
        .on('unlink', sReload);
};

module.exports = _.gulp.series(sg, sgsync);
