const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const jsConfig  = require('../jsconfig');
const parameters = [];

const sitesearch = () => {
    const config = functions.getConfig(dir.config.config);
    const commonVar = functions.getConfig(dir.config.commonvar);
    const plugins = functions.getConfig(dir.config.plugins);

    //リスト出力先の存在確認
    try {
        _.fs.statSync(dir.dist.html);
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

    return _.gulp.src(`${dir.plugins.ejs}/sitesearch/sitesearch.ejs`)
        .pipe(_.plumber())
        .pipe(_.data((file) => {
            return { 'filename': file.path }
        }))
        .pipe(_.ejs({ config, commonVar, parameters, plugins, htmlList }))
        .pipe(_.rename({ extname: '.html' }))
        .pipe(_.replace(jsConfig.htmlInitDel, '$1'))
        .pipe(_.htmlmin(jsConfig.configHtmlMin))
        .pipe(_.replace(jsConfig.htmlSpaceLineDel, ''))
        .pipe(_.gulp.dest(dir.dist.html));
};

module.exports = sitesearch;
