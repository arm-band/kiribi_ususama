const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");
const objFtpDeploy = new _.ftpDeploy();

_.gulp.task("ftp", done => {
    let ftpConfig = functions.getConfig(dir.config.gulpconfig).ftp;
    const hachizetsu = functions.getConfig(dir.config.hachizetsu, "");

    ftpConfig.user = functions.decrypt(String(hachizetsu.key), ftpConfig.user);
    ftpConfig.password = functions.decrypt(String(hachizetsu.key), ftpConfig.password);

    objFtpDeploy.deploy(ftpConfig, (err) => {
        if(err) console.log(err);
        else console.log("ftp deploy finished");
    });
    done();
});