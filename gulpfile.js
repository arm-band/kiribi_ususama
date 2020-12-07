/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */
/* require
*************************************** */
const { series, parallel } = require('gulp');
const dir                  = require('./gulp/dir');
const functions            = require('./gulp/functions');
const browsersync          = require('./gulp/tasks/browsersync');
const ejs                  = require('./gulp/tasks/ejs');
const favicon              = require('./gulp/tasks/favicon');
const envfile              = require('./gulp/tasks/envfile');
const ftp                  = require('./gulp/tasks/ftpdeploy');
const imagemin             = require('./gulp/tasks/imagemin');
const jsBuild              = require('./gulp/tasks/js');
const phpcopy              = require('./gulp/tasks/phpcopy');
const scssTask             = require('./gulp/tasks/sass');
const scss                 = series(scssTask.yaml2sass, scssTask.sass);
const assetsCopy           = require('./gulp/tasks/assetscopy');
const sitemap              = require('./gulp/plugins/sitemap');
const sitemapxml           = require('./gulp/plugins/sitemapxml');
const styleguide           = require('./gulp/plugins/styleguide');
const sitesearch           = require('./gulp/plugins/sitesearch');
const wpEjs                = require('./gulp/plugins/wpejs');
const config = functions.getConfig(dir.config.config);
const plugins = functions.getConfig(dir.config.plugins);

let taskArray = [scss, jsBuild, imagemin, favicon, envfile, assetsCopy];
const taskServer = series(browsersync);
exports.server = taskServer;

if(plugins.usephp) {
    taskArray.push(phpcopy);
}
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

//Scss
exports.yaml2sass = series(scssTask.yaml2sass);
exports.sass = series(scssTask.sass);
exports.scss = scss;
//ejs
exports.ejs = series(taskEjs);
//js
exports.js = parallel(jsBuild);
//image
exports.imagemin = parallel(imagemin);
//favicon
exports.favicon = parallel(favicon);
//envfile
exports.envfile = parallel(envfile);
//php
exports.phpcopy = parallel(phpcopy);
//assets files
exports.assetscopy = parallel(assetsCopy);
//ftp
exports.ftp = parallel(ftp);
//plugins
exports.sitemap = parallel(sitemap);
exports.sitemap = parallel(sitemap);
exports.styleguide = parallel(styleguide);
exports.sitesearch = parallel(sitesearch);

const taskBuild = parallel(taskArray, series(taskEjs));
exports.build = taskBuild;

//ビルドなし
exports.view = taskServer;
//gulpのデフォルトタスクで諸々を動かす
exports.default = series(taskBuild, taskServer);
