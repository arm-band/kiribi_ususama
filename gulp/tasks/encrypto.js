const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");

_.gulp.task("encrypto", done => {
    let gulpConfig = functions.getConfig(dir.config.gulpconfig);
    const hachizetsu = functions.getConfig(dir.config.hachizetsu, "");

    gulpConfig.ftp.user = functions.encrypt(gulpConfig.ftp.user, String(hachizetsu.key));
    gulpConfig.ftp.password = functions.encrypt(gulpConfig.ftp.password, String(hachizetsu.key));

    const newGulpConfig = _.yaml.stringify(gulpConfig);
    _.fs.writeFileSync(dir.config.dir + dir.config.gulpconfig, newGulpConfig);
    done();
});