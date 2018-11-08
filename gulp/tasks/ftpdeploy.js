const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");
const objFtpDeploy = new _.ftpDeploy();

_.gulp.task("ftp", done => {
    const ftpConfig = functions.getConfig(dir.config.gulpconfig).ftp;
    objFtpDeploy.deploy(ftpConfig, (err) => {
        if(err) console.log(err);
        else console.log("ftp deploy finished");
    });
    done();
});