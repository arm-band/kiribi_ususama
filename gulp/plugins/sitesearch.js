const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const rename        = require('gulp-rename');
const ejs           = require('gulp-ejs');
const data          = require('gulp-data');
const replace       = require('gulp-replace');
const htmlmin       = require('gulp-htmlmin');
const fs            = require('fs');
const dir           = require('../dir');
const functions     = require('../functions');
const jsConfig      = require('../jsconfig');
const dotenv        = require('dotenv').config();
const nowDate = functions.formatDate('', 'nodelimiter');
const parameters = [];

const sitesearch = () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const plugins = functions.getConfig(dir.config.plugins);
    const DEV_MODE = process.env.DEV_MODE;

    //リスト出力先の存在確認
    try {
        fs.statSync(dir.dist.html);
    } catch(err) {
        console.log(err);
        return false;
    }
    let fileList = [];
    //探索
    functions.htmlRemoveWalk(functions, dir.dist.html, fileList, config);
    //一覧生成
    let htmlList = '';
    for(let i = 0; i < fileList.length; i++) {
        const filepath = fileList[i][0].replace(/^\.\/dist\//gi, './');
        const filename = fileList[i][1];
        htmlList += `<li><a href="${filepath}"><span class="searchTitle">${filename}</span></a><div class="searchText d-none">${fileList[i][2]}</div></li>\n`;
    }

    return src(`${dir.plugins.ejs}/sitesearch/sitesearch.ejs`)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'sitesearch'
            })
        }))
        .pipe(data((file) => {
            return { 'filename': file.path }
        }))
        .pipe(ejs({ config, commonVar, parameters, plugins, htmlList, nowDate, DEV_MODE }))
        .pipe(rename({ extname: '.html' }))
        .pipe(htmlmin(jsConfig.configHtmlMin))
        .pipe(replace(jsConfig.htmlSpaceLineDel, ''))
        .pipe(dest(dir.dist.html));
};

module.exports = sitesearch;
