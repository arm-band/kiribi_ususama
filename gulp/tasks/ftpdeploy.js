const _         = require("../plugin");
const dir       = require("../dir");
const functions = require("../functions");
const objFtpDeploy = new ftpDeploy();

gulp.task("ftp", done => {
    const ftpConfig = {
        user: user,
        password: "password",
        host: "testserver.example.com",
        port: 21,
        localRoot: "./dist/",
        remoteRoot: "/test/site/to/path/web/",
        include: ["*", "**/*"],
        deleteRemote: false
    };
    objFtpDeploy.deploy(ftpConfig, (err) => {
        if(err) console.log(err);
        else console.log("ftp deploy finished");
    });
    done();
});