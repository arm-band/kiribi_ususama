const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const config = functions.getConfig(dir.config.config);
const plugins = functions.getConfig(dir.config.plugins);
const ejs = require('./ejs');
const wpEjs = require('../plugins/wpejs');
const favicon = require('./favicon');
const imagemin = require('./imagemin');
const jsBuild = require('./js');
const phpcopy = require('./phpcopy');
const scssTask = require('./sass');
const sass = scssTask.sass;
const scss = _.gulp.series(scssTask.yaml2sass, scssTask.sass);
const sitemap = require('../plugins/sitemap');
const sitemapxml = require('../plugins/sitemapxml');
const styleguide = require('../plugins/styleguide');
const sitesearch = require('../plugins/sitesearch');

let taskArray = [scss, jsBuild];
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
    if(plugins.usephp && process.env.PHP_BIN && process.env.PHP_INI && process.env.PHP_PROXY) { //php使うときはこっち
        _.connect.server({
            port: 8001,
            base: dir.dist.html,
            bin: process.env.PHP_BIN,
            ini: process.env.PHP_INI
        }, () =>{
            _.browserSync({
                proxy: process.env.PHP_PROXY,
                open: 'external',
                https: plugins.ssl
            });
        });
    }
    else {
        _.browserSync({
            server: {
                baseDir: dir.dist.html
            },
            open: 'external',
            https: plugins.ssl
        });
    }

    _.watch(`${dir.src.ejs}/**/*.ejs`, _.gulp.series(taskEjs, _.browserSync.reload));
    if(plugins.usephp) {
        _.watch(dir.src.php + '/**/*.php', _.gulp.series(phpcopy, _.browserSync.reload));
    }
    if(plugins.news && functions.isExistFile(`${dir.contents.dir}/1.md`)) {
        _.watch(`${dir.contents.dir}/**/*.md`, _.gulp.series(taskEjs, _.browserSync.reload));
    }
    _.watch(`${dir.src.favicon}/**/*`, _.gulp.series(favicon, _.browserSync.reload));
    _.watch([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}/util/_var.scss`], _.gulp.series(sass, _.browserSync.reload));
    _.watch(`${dir.src.img}/**/*.+(jpg|jpeg|png|gif|svg)`, _.gulp.series(imagemin, _.browserSync.reload));
    _.watch([`${dir.src.js}/**/*.js`, `!${dir.src.js}/concat/**/*.js`], _.gulp.series(jsBuild, _.browserSync.reload));
    _.watch([`${dir.config.dir}/**/*.yml`, `!${dir.config.dir}${dir.config.plugins}`], _.gulp.series(taskBuild, _.browserSync.reload));
};

module.exports = browsersync;