const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const config = functions.getConfig(dir.config.config);
const plugins = functions.getConfig(dir.config.plugins);
const ejs = require('./ejs');
const wpEjs = require('../plugins/wpejs');
const favicon = require('./favicon');
const envfile = require('./envfile');
const imagemin = require('./imagemin');
const jsBuild = require('./js');
const phpcopy = require('./phpcopy');
const { yaml2sass, sass } = require('./sass');
const assetsCopy = require('./assetscopy');
const sitemap = require('../plugins/sitemap');
const sitemapxml = require('../plugins/sitemapxml');
const styleguide = require('../plugins/styleguide');
const sitesearch = require('../plugins/sitesearch');

let taskArray = [yaml2sass];
let taskEjs = [ejs];
if(plugins.wordpress && (config.param.news.wpapi !== undefined && config.param.news.wpapi !== null && config.param.news.wpapi.length > 0)) {
    taskEjs = [wpEjs];
}
if(plugins.sitemap_xml) {
    taskEjs.push(sitemapxml);
}
if(plugins.sitemap) {
    taskEjs.push(sitemap);
}
if(plugins.sitesearch) {
    taskEjs.push(sitesearch);
}

const taskBuild = _.gulp.parallel(taskArray, _.gulp.series(taskEjs));

//自動リロード
const browsersync = () => {
    if(plugins.usephp && process.env.PHP_BIN && process.env.PHP_INI && process.env.PROXY_HOST && process.env.PROXY_PORT) { //php使うときはこっち
        _.connect.server({
            port: process.env.PROXY_PORT,
            base: dir.dist.html,
            bin: process.env.PHP_BIN,
            ini: process.env.PHP_INI
        }, () =>{
            _.browserSync.init({
                proxy: `${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`,
                open: 'external',
                https: plugins.ssl
            });
        });
    }
    else {
        _.browserSync.init({
            server: {
                baseDir: dir.dist.html
            },
            open: 'external',
            https: plugins.ssl
        });
    }

    const sEjs = _.gulp.series(taskEjs, _.browserSync.reload);
    _.gulp.watch(
        `${dir.src.ejs}/**/*.ejs`
    )
        .on('add',    sEjs)
        .on('change', sEjs)
        .on('unlink', sEjs);
    const sPhp = _.gulp.series(phpcopy, _.browserSync.reload);
    if(plugins.usephp) {
        _.gulp.watch(
            dir.src.php + '/**/*.php'
        )
            .on('add',    sPhp)
            .on('change', sPhp)
            .on('unlink', sPhp);
    }
    if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
        _.gulp.watch(
            `${dir.contents.dir}/**/*.md`
        )
            .on('add',    sEjs)
            .on('change', sEjs)
            .on('unlink', sEjs);
    }
    const sFavicon = _.gulp.series(favicon, _.browserSync.reload);
    _.gulp.watch(
        `${dir.src.favicon}/**/*.+(png|ico|icon)`
    )
        .on('add',    sFavicon)
        .on('change', sFavicon)
        .on('unlink', sFavicon);
    const sEnvfile = _.gulp.series(envfile, _.browserSync.reload);
    _.gulp.watch(
        `${dir.src.envfile}/**/*`
    )
        .on('add',    sEnvfile)
        .on('change', sEnvfile)
        .on('unlink', sEnvfile);
    const sSass = _.gulp.series(sass, _.browserSync.reload);
    let ignoreListArray = [
        `${dir.src.scss}/util/_var.scss`,
        `${dir.src.scss}${dir.src.scssassets}/bootstrap/bootstrap.scss`,
        `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/bootstrap/**`,
        `${dir.src.scss}${dir.src.scssassets}/bootstrap/honoka/honoka/**`
    ];
    if(!plugins.noscript) {
        ignoreListArray.push(`${dir.src.scss}/noscript.scss`);
    }
    _.gulp.watch(
        `${dir.src.scss}/**/*.scss`,
        {
            ignored: ignoreListArray
        }
    )
        .on('add',    sSass)
        .on('change', sSass)
        .on('unlink', sSass);
    const sImagemin = _.gulp.series(imagemin, _.browserSync.reload);
    _.gulp.watch(
        `${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`
    )
        .on('add',    sImagemin)
        .on('change', sImagemin)
        .on('unlink', sImagemin);
    const sJs = _.gulp.series(jsBuild, _.browserSync.reload);
    _.gulp.watch(
        `${dir.src.js}/**/*.js`,
        {
            ignored: [
                `${dir.src.js}/concat/**`,
                `${dir.src.js}/_plugins/**`
            ]
        }
    )
        .on('add',    sJs)
        .on('change', sJs)
        .on('unlink', sJs);
    const sAssetscopy = _.gulp.series(assetsCopy, _.browserSync.reload);
    _.gulp.watch(
        `${dir.src.assets}/**/*.+(pdf|docx|xlsx|pptx)`
    )
        .on('add',    sAssetscopy)
        .on('change', sAssetscopy)
        .on('unlink', sAssetscopy);
    const sBuild = _.gulp.series(taskBuild, _.browserSync.reload);
    _.gulp.watch(
        [
            `${dir.config.dir}/config.yml`,
            `${dir.config.dir}/commonvar.yml`
        ]
    )
        .on('add',    sBuild)
        .on('change', sBuild);
};

module.exports = browsersync;
