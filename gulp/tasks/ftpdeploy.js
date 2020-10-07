const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const objFtpDeploy = new _.ftpDeploy();

const ftp = (done) => {
    if (process.env.DEV_MODE === 'demo' || process.env.DEV_MODE === 'prod') {
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
    }
    else if (process.env.DEV_MODE === 'dev') {
        console.log('FTP deploy locked: DEV_MODE set "dev".');
    }
    else {
        console.log('DEV_MODE set invalid value.');
    }
    done();
};

module.exports = ftp;
