const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");

//自動リロード
_.gulp.task("admin.browsersync", () => {
    _.browserSync({
        server: {
            baseDir: "./admin/"
        },
        open: 'external',
        https: true
    });
});