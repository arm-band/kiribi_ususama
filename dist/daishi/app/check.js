const validation = require('./validation');
const labelList = require("./parameters/labelList");
const errMsg = require("./parameters/errMsg");

module.exports = {
    check: (paramConfig, paramCommonVar, paramGulpConfig) => {
        let msg = [];
        /* 一般設定
        *************************** */
        //サイト名
        if(!validation.empty(paramConfig.siteName)) {
            msg.push(`errMsg00: ${labelList.config.siteName}は${errMsg["00"]}`);
        }
        else if(!validation.text(paramConfig.siteName)) {
            msg.push(`errMsg01: ${labelList.config.siteName}が${errMsg["01"]}`);
        }
        //説明
        if(paramConfig.description.length > 0 && !validation.text(paramConfig.description)) {
            msg.push(`errMsg01: ${labelList.config.description}が${errMsg["01"]}`);
        }
        //著者情報
        if(!validation.empty(paramConfig.author)) {
            msg.push(`errMsg00: ${labelList.config.author}は${errMsg["00"]}`);
        }
        else if(!validation.text(paramConfig.author)) {
            msg.push(`errMsg01: ${labelList.config.author}が${errMsg["01"]}`);
        }
        //テーマカラー
        if(paramCommonVar.themeColor.length > 0 && !validation.color(paramCommonVar.themeColor)) {
            msg.push(`errMsg05: ${labelList.commonVar.themeColor}の${errMsg["05"]}`);
        }
        //年
        if(!validation.empty(paramConfig.CRYear)) {
            msg.push(`errMsg00: ${labelList.config.CRYear}は${errMsg["00"]}`);
        }
        else if(!validation.year(paramConfig.CRYear)) {
            msg.push(`errMsg03: ${labelList.config.CRYear}の${errMsg["03"]}`);
        }
        /* OGP
        *************************** */
        //TwitterユーザID
        if(paramConfig.OGPTUserID.length > 0 && !validation.alphabet(paramConfig.OGPTUserID)) {
            msg.push(`errMsg02: ${labelList.config.OGPTUserID}に${errMsg["02"]}`);
        }
        //OGP画像
        if(paramConfig.OGPImage.length > 0 && !validation.alphabet(paramConfig.OGPImage)) {
            msg.push(`errMsg02: ${labelList.config.OGPImage}に${errMsg["02"]}`);
        }
        //URL
        if(paramConfig.URL.length > 0 && !validation.url(paramConfig.URL)) {
            msg.push(`errMsg04: ${labelList.config.URL}に${errMsg["02"]}`);
        }
        /* Ususama設定
        *************************** */
        //php使用
        if(!validation.checkbox(paramGulpConfig.functions.usephp)) {
            msg.push(`errMsg06: ${labelList.gulpConfig.functions.usephp}の${errMsg["06"]}`);
        }
        //新着情報生成
        if(!validation.checkbox(paramGulpConfig.functions.news)) {
            msg.push(`errMsg06: ${labelList.gulpConfig.functions.news}の${errMsg["06"]}`);
        }
        //HTTPS通信
        if(!validation.checkbox(paramGulpConfig.functions.ssl)) {
            msg.push(`errMsg06: ${labelList.gulpConfig.functions.ssl}の${errMsg["06"]}`);
        }
        /* FTP情報
        *************************** */
        //ユーザID
        if(paramGulpConfig.ftp.ftpUser.length > 0 && !validation.alphabet(paramGulpConfig.ftp.ftpUser)) {
            msg.push(`errMsg02: ${labelList.gulpConfig.ftp.ftpUser}に${errMsg["02"]}`);
        }
        //パスワード
        if(paramGulpConfig.ftp.ftpPswd.length > 0 && !validation.alphabet(paramGulpConfig.ftp.ftpPswd)) {
            msg.push(`errMsg02: ${labelList.gulpConfig.ftp.ftpPswd}に${errMsg["02"]}`);
        }
        //ホスト名
        if(paramGulpConfig.ftp.ftpHost.length > 0 && !validation.alphabet(paramGulpConfig.ftp.ftpHost)) {
            msg.push(`errMsg02: ${labelList.gulpConfig.ftp.ftpHost}に${errMsg["02"]}`);
        }
        //ローカルパス
        if(paramGulpConfig.ftp.ftpLocal.length > 0 && !validation.alphabet(paramGulpConfig.ftp.ftpLocal)) {
            msg.push(`errMsg02: ${labelList.gulpConfig.ftp.ftpLocal}に${errMsg["02"]}`);
        }
        //リモートパス
        if(paramGulpConfig.ftp.ftpRemote.length > 0 && !validation.alphabet(paramGulpConfig.ftp.ftpRemote)) {
            msg.push(`errMsg02: ${labelList.gulpConfig.ftp.ftpRemote}に${errMsg["02"]}`);
        }
        return msg;
    }
};