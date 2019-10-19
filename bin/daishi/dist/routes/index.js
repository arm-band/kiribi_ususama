const _         = require('../../../../gulp/plugin');
const dir       = require('../../../../gulp/dir');
const functions = require('../../../../gulp/functions');
const express   = require('express');
const router    = express.Router();
const labelList = require('../app/parameters/labelList');

/* GET home page. */
router.get('/', (req, res, next) => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const plugins = functions.getConfig(dir.config.plugins);
    let ftpConfig = functions.getConfig(dir.config.ftpconfig);
    const hachizetsu = functions.getConfig(`${dir.config.dir}${dir.config.hachizetsu}`, '');
    //前処理
    ftpConfig.user = functions.decrypt(String(hachizetsu.key), ftpConfig.user, functions);
    ftpConfig.password = functions.decrypt(String(hachizetsu.key), ftpConfig.password, functions);
    res.render('index', {
        config: config,
        commonVar: commonVar,
        plugins: plugins,
        ftpConfig: ftpConfig,
        filename: 'index',
        pagecat: 'init',
        labelList: labelList
    });
    res.end();
})

module.exports = router;