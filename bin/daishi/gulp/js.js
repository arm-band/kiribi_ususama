const _         = require('../../../gulp/plugin');
const dir       = require('../../../gulp/dir');

//js
const adminSjConcat = () => {
    return _.gulp.src([`${dir.assets.jquery}/jquery.min.js`, `${dir.assets.bootstrap}/bootstrap.bundle.min.js`, `${dir.assets.easing}/jquery.easing.js`])
        .pipe(_.plumber())
        .pipe(_.concat('lib.js'))
        .pipe(_.gulp.dest(`${dir.admin.dir}${dir.admin.js}/concat/`)); //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
};
const adminJsUglify = () => {
    return _.gulp.src(`${dir.admin.dir}${dir.admin.js}/**/*.js`)
        .pipe(_.plumber())
        .pipe(_.uglify({output: {comments: 'some'}}))
        .pipe(_.rename((path) => {
            path.dirname = `${dir.admin.dir}${dir.admin.distjs}`
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(_.gulp.dest('./'));
};
//上記をまとめておく
module.exports = _.gulp.series(adminSjConcat, adminJsUglify);