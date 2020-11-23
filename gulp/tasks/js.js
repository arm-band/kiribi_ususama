const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const plugins = functions.getConfig(dir.config.plugins);

//js圧縮&結合&リネーム
const jsConcat = () => {
    let libSrcArray = [
        `${dir.assets.jquery}/jquery.min.js`,
        `${dir.assets.bootstrap}/bootstrap.bundle.js`,
        `${dir.assets.easing}/jquery.easing.js`
    ];
    if(plugins.lightbox) {
        libSrcArray.push(`${dir.assets.lightbox}/js/lightbox.js`);
    }
    if(plugins.slick) {
        libSrcArray.push(`${dir.assets.slick}/slick.js`);
    }
    if(plugins.sitesearch) {
        libSrcArray.push(`${dir.assets.listjs}/list.js`);
    }
    if(plugins.safari) {
        libSrcArray.push(`${dir.assets.bowser}/bundled.js`);
    }
    libSrcArray.push(`${dir.src.js}/_plugins/_plugins.js`);

    return _.gulp.src(libSrcArray)
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'jsConcat'
            })
        }))
        .pipe(_.concat('lib.js'))
        .pipe(_.gulp.dest(`${dir.src.js}/concat/`)); //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
};
const jsLibBuild = () => {
    return _.gulp.src(`${dir.src.js}/concat/**/*.js`)
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'jsLibBuild'
            })
        }))
        .pipe(_.uglify({
            output: {
                comments: 'all'
            }
        }))
        .pipe(_.rename((path) => {
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(_.gulp.dest(dir.dist.js));
};
const jsBuild = () => {
    let paramSrc = {
        ignore: [
            `${dir.src.js}/concat/**`,
            `${dir.src.js}/_plugins/**`
        ]
    };
    let paramDist = {};
    if (process.env.DEV_MODE === 'dev') {
        paramSrc.sourcemaps = true;
        paramDist.sourcemaps = true;
    }
    return _.gulp.src(`${dir.src.js}/**/*.js`, paramSrc)
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'jsBuild'
            })
        }))
        .pipe(_.uglify({
            output: {
                comments: 'some'
            }
        }))
        .pipe(_.rename((path) => {
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(_.gulp.dest(dir.dist.js, paramDist));
};

module.exports = _.gulp.series(jsConcat, jsLibBuild, jsBuild);
