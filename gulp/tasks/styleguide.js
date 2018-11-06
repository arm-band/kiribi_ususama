const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");

//styleguide(FrontNote)
_.gulp.task("styleguide", () => {
    return _.gulp.src(dir.src.scss + "/**/*.scss") // 監視対象のファイルを指定
        .pipe(_.frontnote({
            out: dir.sg.html,
            title: functions.getConfig(dir.config.config).commons.sitename,
            css: [`${dir.sg.css}/contents.css`, `${dir.sg.css}/index.css`, `${dir.sg.canceller}/fncanceller.css`, "https://fonts.googleapis.com/css?family=Dancing+Script", "https://fonts.googleapis.com/earlyaccess/sawarabimincho.css", "https://use.fontawesome.com/releases/v5.2.0/css/all.css"],
            script: [`${dir.sg.js}/lib.min.js`, `${dir.sg.js}/app.min.js`],
            template: `${dir.sg.template}/index.ejs`,
            overview: dir.sg.md,
            params: { "commonVar": functions.getConfig(dir.config.commonvar) }
        }));
});