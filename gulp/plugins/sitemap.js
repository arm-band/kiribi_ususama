const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');
const jsConfig  = require('../jsconfig');
const parameters = [];

const sitemap = () => {
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
    functions.htmlWalk(functions, dir.dist.html, fileList, config);
    //ソート
    fileList = _._sortBy(fileList, ['dirStr', 'depth']);
    //一覧生成
    let htmlList = '';
    const indexHtml = 'index.html';
    const pathIndexHtml = `${dir.dist.html}/${indexHtml}`;
    let currentParam = {
        'dirStr': dir.dist.html,
        'depth': pathIndexHtml.split('/').length //., dist, index.html
    }
    if(_.fs.statSync(pathIndexHtml)) {
        htmlList += `<li><a href="${indexHtml}">ホーム</a></li>\n`;
    }
    for(let i = 0; i < fileList.length; i++) {
        const filepath = fileList[i]['path'].replace(/^\.\/dist\//gi, './');
        if(filepath !== `./${indexHtml}`) {
            const filename = fileList[i]['title'];
            if(fileList[i]['depth'] > currentParam.depth) { //掘る
                htmlList = htmlList.replace(/<\/li>\n$/g, '');
                htmlList += `\n<ul><li><a href="${filepath}">${filename}</a></li>\n`;
            }
            else if(currentParam.depth > fileList[i]['depth']) { //戻る
                defDepth = currentParam.depth - fileList[i]['depth'];
                let closeUl = '';
                for(let j = 0; j < defDepth; j++) {
                    closeUl += '</ul></li>\n';
                }
                htmlList += `${closeUl}<li><a href="${filepath}">${filename}</a></li>\n`;
            }
            else { // 同じ階層
                htmlList += `<li><a href="${filepath}">${filename}</a></li>\n`;
            }
            //上書き
            currentParam.dirStr = fileList[i]['dirStr'];
            currentParam.depth = fileList[i]['depth'];
        }
    }

    //最後
    if(fileList[fileList.length - 1]['depth'] > pathIndexHtml.split('/').length) {
        let closeUl = '';
        for(let j = 0; j < fileList[fileList.length - 1]['depth'] - pathIndexHtml.split('/').length; j++) {
            closeUl += '</ul></li>\n';
        }
        htmlList += `${closeUl}`;
    }

    return _.gulp.src(`${dir.plugins.ejs}/sitemap/sitemap.ejs`)
        .pipe(_.plumber({
            errorHandler: _.notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'sitemap'
            })
        }))
        .pipe(_.data((file) => {
            return { 'filename': file.path }
        }))
        .pipe(_.ejs({ config, commonVar, parameters, plugins, htmlList }))
        .pipe(_.rename({ extname: '.html' }))
        .pipe(_.htmlmin(jsConfig.configHtmlMin))
        .pipe(_.replace(jsConfig.htmlSpaceLineDel, ''))
        .pipe(_.gulp.dest(dir.dist.html));
};

module.exports = sitemap;
