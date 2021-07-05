const { series, parallel, watch } = require('gulp');
const browserSync                 = require('browser-sync').create();
const connect                     = require('gulp-connect-php');
const dir                         = require('../dir');
const functions                   = require('../functions');
const ejs                         = require('./ejs');
const wpEjs                       = require('../plugins/wpejs');
const favicon                     = require('./favicon');
const envfile                     = require('./envfile');
const imagemin                    = require('./imagemin');
const jsBuild                     = require('./js');
const phpcopy                     = require('./phpcopy');
const { yaml2sass, sass }         = require('./sass');
const assetsCopy                  = require('./assetscopy');
const sitemap                     = require('../plugins/sitemap');
const sitemapxml                  = require('../plugins/sitemapxml');
const sitesearch                  = require('../plugins/sitesearch');
const dotenv                      = require('dotenv').config();
const config = functions.getConfig(dir.config.config);
const plugins = functions.getConfig(dir.config.plugins);

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

const taskBuild = parallel(taskArray, series(taskEjs));

const bsOpenOptions = process.env.DOCKER_MODE === 'true' ? false : 'external';
const watchOptions = process.env.DOCKER_MODE === 'true' ? {
    usePolling: true
} : {};
let ignoreListArray = [];
if(!plugins.noscript) {
    ignoreListArray.push(`${dir.src.scss}/noscript.scss`);
}
const watchSassOptions = process.env.DOCKER_MODE === 'true' ? {
    ignored: ignoreListArray,
    usePolling: true
} : {
    ignored: ignoreListArray
};


//自動リロード
const browsersync = () => {
    if(plugins.usephp && process.env.PROXY_HOST && process.env.PROXY_PORT) { //php使うときはこっち
        connect.server({
            port: process.env.PROXY_PORT,
            base: dir.dist.html,
        }, () => {
            browserSync.init({
                proxy: `${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`,
                open: bsOpenOptions,
                https: plugins.ssl
            });
        });
    }
    else {
        browserSync.init({
            server: {
                baseDir: dir.dist.html
            },
            open: bsOpenOptions,
            https: plugins.ssl
        });
    }

    const sEjs = series(taskEjs, browserSync.reload);
    watch(
        `${dir.src.ejs}/**/*.ejs`,
        watchOptions
    )
        .on('add',    sEjs)
        .on('change', sEjs)
        .on('unlink', sEjs);
    const sPhp = series(phpcopy, browserSync.reload);
    if(plugins.usephp) {
        watch(
            `${dir.src.php}/**/*.php`,
            watchOptions
        )
            .on('add',    sPhp)
            .on('change', sPhp)
            .on('unlink', sPhp);
    }
    if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
        watch(
            `${dir.contents.dir}/**/*.md`,
            watchOptions
        )
            .on('add',    sEjs)
            .on('change', sEjs)
            .on('unlink', sEjs);
    }
    const sFavicon = series(favicon, browserSync.reload);
    watch(
        `${dir.src.favicon}/**/*.+(png|ico|icon)`,
        watchOptions
    )
        .on('add',    sFavicon)
        .on('change', sFavicon)
        .on('unlink', sFavicon);
    const sEnvfile = series(envfile, browserSync.reload);
    watch(
        `${dir.src.envfile}/**/*`,
        watchOptions
    )
        .on('add',    sEnvfile)
        .on('change', sEnvfile)
        .on('unlink', sEnvfile);
    const sSass = series(sass, browserSync.reload);
    watch(
        `${dir.src.scss}/**/*.scss`,
        watchSassOptions
    )
        .on('add',    sSass)
        .on('change', sSass)
        .on('unlink', sSass);
    const sImagemin = series(imagemin, browserSync.reload);
    watch(
        `${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`,
        watchOptions
    )
        .on('add',    sImagemin)
        .on('change', sImagemin)
        .on('unlink', sImagemin);
    const sJs = series(jsBuild, browserSync.reload);
    watch(
        `${dir.src.js}/**/*.js`,
        watchOptions
    )
        .on('add',    sJs)
        .on('change', sJs)
        .on('unlink', sJs);
    const sAssetscopy = series(assetsCopy, browserSync.reload);
    watch(
        `${dir.src.assets}/**/*.+(pdf|docx|xlsx|pptx)`,
        watchOptions
    )
        .on('add',    sAssetscopy)
        .on('change', sAssetscopy)
        .on('unlink', sAssetscopy);
    const sBuild = series(taskBuild, browserSync.reload);
    watch(
        [
            `${dir.config.dir}/config.yml`,
            `${dir.config.dir}/commonvar.yml`
        ],
        watchOptions
    )
        .on('add',    sBuild)
        .on('change', sBuild);
};

module.exports = browsersync;
