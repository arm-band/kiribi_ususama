const _         = require("../plugin");
const dir       = require("../gulp/dir");
const functions = require("../functions");
const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;
const direc = `${dir.src.ejs}/templates/`;

if(!gulpConfig.democontents) { //デモコンテンツを使用しない場合、デモコンテンツのファイルを削除
    let templateList = [];
    const contentMD = "---\
layout: article.ejs\
title: コンテンツタイトル\
date: 2018-11-22T23:30:00+09:00\
thumbnail: eyecatch.jpg\
excerpt: 記事の概要です\
---\
\
### 記事タイトル\
\
記事はMarkdown記法で記述できます。記事のファイル名は数字で作成順にしてください。\
\
### 先頭の---で区切られた部分について\
\
先頭の`---`で区切られた部分はタイトルや更新日時、記事ページのテンプレートを指定するメタ情報を含む部分となっています。";
    //_template-*.ejsファイルの一覧を取得
    _.fs.readdirSync(direc, (err, files) => {
        if (err) throw err;
        templateList = files.filter((file) => {
            var filePath = direc + file;
            return _.fs.statSync(filePath).isFile() && /^_template_(.*)\.ejs$/.test(filePath);
        });
    });
    //_template-*.ejsファイルごとにファイルコピーし、元のテンプレートファイルを削除
    for(let i in templateList) {
        const filename = templateList[i].split("-");
        const distFileName = filename[filename.length - 1];
        let path = `${dir.src.ejs}/`;
        if(distFileName.indexOf("header") !== -1) {
            path += "partial/";
        }
        path += `${distFileName}.html`;
        _.copyfiles([templateList[i], path]);
    };
    //全てのmdファイルを削除
    _.rimraf(`${dir.contents.dir}/*.md`);
    //サンプル記事追加
    _.fs.writeFileSync(`${dir.contents.dir}/1.md`, contentMD);
}
//テンプレートディレクトリ削除
_.rimraf(direc);