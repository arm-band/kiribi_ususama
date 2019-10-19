const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const objFtpDeploy = new _.ftpDeploy();

const ftp = (done) => {
    let ftpConfig = functions.getConfig(dir.config.ftp, '');
    const hachizetsu = functions.getConfig(dir.config.hachizetsu, '');

    ftpConfig.user = functions.decrypt(String(hachizetsu.key), ftpConfig.user, functions);
    ftpConfig.password = functions.decrypt(String(hachizetsu.key), ftpConfig.password, functions);

    objFtpDeploy.deploy(ftpConfig, (err) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log('ftp deploy finished');
        }
    });
    done();
};

module.exports = ftp;