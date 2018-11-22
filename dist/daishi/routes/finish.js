const _         = require("../../../gulp/plugin");
const dir       = require("../../../gulp/dir");
const functions = require("../../../gulp/functions");
const express   = require("express");
const router    = express.Router();
const escape = require('../app/escape');
const decode = require('../app/decode');
const check = require('../app/check');
const substitute = require('../app/substitute');
const fileOperator = require('../app/file');

router.post("/", function(req, res, next) {
    const unpressed = escape.escapeMinimal(req.body.unpressed, functions);
    if(unpressed !== "true") {
        let config = functions.getConfig(dir.config.config);
        let commonVar = functions.getConfig(dir.config.commonvar);
        let gulpConfig = functions.getConfig(dir.config.gulpconfig);
        const hachizetsu = functions.getConfig(dir.config.hachizetsu, "");
        const paramConfig = {
            siteName: escape.escapeMinimal(req.body.siteName, functions),
            description: escape.escapeMinimal(req.body.description, functions),
            author: escape.escapeMinimal(req.body.author, functions),
            CRYear: escape.escapeMinimal(req.body.CRYear, functions),
            OGPTUserID: escape.escapeMinimal(req.body.OGPTUserID, functions),
            OGPImage: escape.escapeMinimal(req.body.OGPImage, functions),
            URL: escape.escapeMinimal(req.body.URL, functions)
        };
        const paramCommonVar = {
            themeColor: escape.escapeMinimal(req.body.themeColor, functions)
        };
        const paramGulpConfig = {
            functions: {
                usephp: escape.escapeMinimal(req.body.usephp, functions),
                news: escape.escapeMinimal(req.body.news, functions),
                ssl: escape.escapeMinimal(req.body.ssl, functions),
                democontents: escape.escapeMinimal(req.body.democontents, functions)
            },
            ftp: {
                ftpUser: escape.escapeMinimal(req.body.ftpUser, functions),
                ftpPswd: escape.escapeMinimal(req.body.ftpPswd, functions),
                ftpHost: escape.escapeMinimal(req.body.ftpHost, functions),
                ftpLocal: escape.escapeMinimal(req.body.ftpLocal, functions),
                ftpRemote: escape.escapeMinimal(req.body.ftpRemote, functions)
            }
        };
        //エラーチェック
        let msg = check.check(paramConfig, paramCommonVar, paramGulpConfig);
        if(msg.length === 0) { //エラーが無ければ書き込み
            //代入
            config.commons.sitename = paramConfig.siteName;
            config.commons.description = paramConfig.description;
            config.commons.year = parseInt(paramConfig.CRYear);
            config.commons.author = paramConfig.author;
            config.commons.ogpimage = paramConfig.OGPImage;
            config.commons.twitteraccount = paramConfig.OGPTUserID;
            config.commons.url = paramConfig.URL;
            commonVar["main-color"] = paramCommonVar.themeColor;
            gulpConfig.functions.usephp = substitute.checkbox(paramGulpConfig.functions.usephp);
            gulpConfig.functions.news = substitute.checkbox(paramGulpConfig.functions.news);
            gulpConfig.functions.ssl = substitute.checkbox(paramGulpConfig.functions.ssl);
            gulpConfig.functions.democontents = substitute.checkbox(paramGulpConfig.functions.democontents);
            gulpConfig.ftp.user = functions.encrypt(paramGulpConfig.ftp.ftpUser, String(hachizetsu.key), functions);
            gulpConfig.ftp.password = functions.encrypt(paramGulpConfig.ftp.ftpPswd, String(hachizetsu.key), functions);
            gulpConfig.ftp.host = paramGulpConfig.ftp.ftpHost;
            gulpConfig.ftp.localRoot = paramGulpConfig.ftp.ftpLocal;
            gulpConfig.ftp.remoteRoot = paramGulpConfig.ftp.ftpRemote;
            //yml変換した内容をファイル書き込み
            msg = fileOperator.write(dir.config.dir + dir.config.config, decode.decodeMinimal(_.yaml.stringify(config), functions), msg);
            msg = fileOperator.write(dir.config.dir + dir.config.commonvar, decode.decodeMinimal(_.yaml.stringify(commonVar), functions), msg);
            msg = fileOperator.write(dir.config.dir + dir.config.gulpconfig, decode.decodeMinimal(_.yaml.stringify(gulpConfig), functions), msg);
        }
        res.render("finish", {
            config: config,
            commonVar: commonVar,
            msg: msg,
            unpressed: unpressed,
            filename: "finish",
            pagecat: "init"
        });
        res.end();
    }
    else {
        res.render("finish", {
            unpressed: unpressed,
            filename: "finish",
            pagecat: "init"
        });
        res.end();
        process.exit(0);
    }
});

module.exports = router;