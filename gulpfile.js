/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */
/* require
*************************************** */
const _         = require('./gulp/plugin');
const dir       = require('./gulp/dir');
const functions = require('./gulp/functions');
const config = functions.getConfig(dir.config.config);
const plugins = functions.getConfig(dir.config.plugins);
const browsersync = require('./gulp/tasks/browsersync');
const ejs = require('./gulp/tasks/ejs');
const favicon = require('./gulp/tasks/favicon');
const envfile = require('./gulp/tasks/envfile');
const ftp = require('./gulp/tasks/ftpdeploy');
const imagemin = require('./gulp/tasks/imagemin');
const jsBuild = require('./gulp/tasks/js');
const phpcopy = require('./gulp/tasks/phpcopy');
const scssTask = require('./gulp/tasks/sass');
const scss = _.gulp.series(scssTask.yaml2sass, scssTask.sass);
const assetsCopy = require('./gulp/tasks/assetscopy');
const sitemap = require('./gulp/plugins/sitemap');
const sitemapxml = require('./gulp/plugins/sitemapxml');
const styleguide = require('./gulp/plugins/styleguide');
const sitesearch = require('./gulp/plugins/sitesearch');
const wpEjs = require('./gulp/plugins/wpejs');
const adminJs = require('./bin/daishi/gulp/js');
const adminSass = require('./bin/daishi/gulp/sass');

let taskArray = [scss, jsBuild, imagemin, favicon, envfile, assetsCopy];
const taskServer = _.gulp.series(browsersync);
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
exports.yaml2sass = _.gulp.series(scssTask.yaml2sass);
exports.sass = _.gulp.series(scssTask.sass);
exports.scss = scss;
//ejs
exports.ejs = _.gulp.series(taskEjs);
//js
exports.js = _.gulp.parallel(jsBuild);
//image
exports.imagemin = _.gulp.parallel(imagemin);
//favicon
exports.favicon = _.gulp.parallel(favicon);
//envfile
exports.envfile = _.gulp.parallel(envfile);
//php
exports.phpcopy = _.gulp.parallel(phpcopy);
//assets files
exports.assetscopy = _.gulp.parallel(assetsCopy);
//ftp
exports.ftp = _.gulp.parallel(ftp);
//plugins
exports.sitemap = _.gulp.parallel(sitemap);
exports.sitemap = _.gulp.parallel(sitemap);
exports.styleguide = _.gulp.parallel(styleguide);
exports.sitesearch = _.gulp.parallel(sitesearch);

const taskBuild = _.gulp.parallel(taskArray, _.gulp.series(taskEjs));
exports.build = taskBuild;

//ビルドなし
exports.view = taskServer;
//gulpのデフォルトタスクで諸々を動かす
exports.default = _.gulp.series(taskBuild, taskServer);

//daishi
exports.daishi = _.gulp.series(adminSass, adminJs);
