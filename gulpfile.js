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
const plugins = functions.getConfig(dir.config.plugins);
const browsersync = require('./gulp/tasks/browsersync');
const ejs = require('./gulp/tasks/ejs');
const favicon = require('./gulp/tasks/favicon');
const ftp = require('./gulp/tasks/ftpdeploy');
const imagemin = require('./gulp/tasks/imagemin');
const jsBuild = require('./gulp/tasks/js');
const phpcopy = require('./gulp/tasks/phpcopy');
const scssTask = require('./gulp/tasks/sass');
const scss = _.gulp.series(scssTask.yaml2sass, scssTask.sass);
const sitemap = require('./gulp/plugins/sitemap');
const sitemapxml = require('./gulp/plugins/sitemapxml');
const styleguide = require('./gulp/plugins/styleguide');
const adminJs = require('./bin/daishi/gulp/js');
const adminSass = require('./bin/daishi/gulp/sass');

let taskArray = [scss, jsBuild, imagemin, favicon, ejs];
const taskServer = _.gulp.series(browsersync);
exports.server = taskServer;

if(plugins.usephp) {
    taskArray.push(phpcopy);
}

const taskBuild = _.gulp.parallel(taskArray);
exports.build = taskBuild;

//ビルドなし
exports.view = taskServer;
//gulpのデフォルトタスクで諸々を動かす
exports.default = _.gulp.series(taskBuild, taskServer);

//daishi
exports.daishi = _.gulp.series(adminSass, adminJs);