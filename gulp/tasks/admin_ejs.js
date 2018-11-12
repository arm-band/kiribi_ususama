const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");

//ejs
_.gulp.task("admin.ejs", () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const gulpConfig = functions.getConfig(dir.config.gulpconfig);

    return _.gulp.src(`${dir.src.ejs}/admin/*.ejs`)
    .pipe(_.plumber())
    .pipe(_.data((file) => {
        return { "filename": file.path }
    }))
    .pipe(_.ejs({ config, commonVar, gulpConfig }))
    .pipe(_.rename(`./admin/index.html`))
    .pipe(_.gulp.dest("./"));
});