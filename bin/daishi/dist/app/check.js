const validation = require('./validation');
const labelList = require("./parameters/labelList");
const errMsg = require("./parameters/errMsg");

module.exports = {
    check: (paramConfig, paramCommonVar, paramPlugins, paramFtpConfig) => {
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
        if(!validation.checkbox(paramPlugins.usephp)) {
            msg.push(`errMsg06: ${labelList.plugins.usephp}の${errMsg["06"]}`);
        }
        //新着情報生成
        if(!validation.checkbox(paramPlugins.news)) {
            msg.push(`errMsg06: ${labelList.plugins.news}の${errMsg["06"]}`);
        }
        //HTTPS通信
        if(!validation.checkbox(paramPlugins.ssl)) {
            msg.push(`errMsg06: ${labelList.plugins.ssl}の${errMsg["06"]}`);
        }
        /* FTP情報
        *************************** */
        //ユーザID
        if(paramFtpConfig.user.length > 0 && !validation.alphabet(paramFtpConfig.user)) {
            msg.push(`errMsg02: ${labelList.ftpConfig.user}に${errMsg["02"]}`);
        }
        //パスワード
        if(paramFtpConfig.password.length > 0 && !validation.alphabet(paramFtpConfig.password)) {
            msg.push(`errMsg02: ${labelList.ftpConfig.password}に${errMsg["02"]}`);
        }
        //ホスト名
        if(paramFtpConfig.host.length > 0 && !validation.alphabet(paramFtpConfig.host)) {
            msg.push(`errMsg02: ${labelList.ftpConfig.host}に${errMsg["02"]}`);
        }
        //ローカルパス
        if(paramFtpConfig.localRoot.length > 0 && !validation.alphabet(paramFtpConfig.localRoot)) {
            msg.push(`errMsg02: ${labelList.ftpConfig.localRoot}に${errMsg["02"]}`);
        }
        //リモートパス
        if(paramFtpConfig.remoteRoot.length > 0 && !validation.alphabet(paramFtpConfig.remoteRoot)) {
            msg.push(`errMsg02: ${labelList.ftpConfig.remoteRoot}に${errMsg["02"]}`);
        }
        return msg;
    }
};