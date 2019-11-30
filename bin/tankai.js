const _         = require('../gulp/plugin');
const objFtpDeploy = new _.ftpDeploy();
//FTPの設定
let ftpConfig = {
    'user': '',
    'password': '',
    'host': '',
    'port': 21,
    'localRoot': './dist/',
    'remoteRoot': '',
    'include': ["*", "**/*"],
    'exclude': null,
    'deleteRemote': true
};
//フラグ
let argsFlag = {
    'user': false,
    'password': false,
    'host': false,
    'remoteroot': false
};

if(process.argv[2] !== undefined && process.argv[2] !== null && process.argv[2].length > 0) {
    ftpConfig.user = process.argv[2];
    argsFlag.user = true;
}
if(process.argv[3] !== undefined && process.argv[3] !== null && process.argv[3].length > 0) {
    ftpConfig.password = process.argv[3];
    argsFlag.password = true;
}
if(process.argv[4] !== undefined && process.argv[4] !== null && process.argv[4].length > 0) {
    ftpConfig.host = process.argv[4];
    argsFlag.host = true;
}
if(process.argv[5] !== undefined && process.argv[5] !== null && process.argv[5].length > 0) {
    ftpConfig.remoteRoot = process.argv[5];
    argsFlag.remoteroot = true;
}

if(argsFlag.user && argsFlag.password && argsFlag.host && argsFlag.remoteroot) {
    try {
        objFtpDeploy.deploy(ftpConfig, (err) => {
            if(err) {
                throw new Error(err);
            }
            else {
                console.log('ftp deploy finished');
            }
        });
    }
    catch {
        console.log('FTPデプロイが失敗しました: ' + err);
    }
}
else {
    console.log('Github Secrets パラメータが不正です');
}