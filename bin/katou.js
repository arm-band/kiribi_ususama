const copyfiles = require("copyfiles");
const rimraf    = require("rimraf");
const fs        = require("fs");
const dir       = require("../gulp/dir");
const functions = require("../gulp/functions");
const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;
const direc = `${dir.template.dir}/`;

if(!gulpConfig.democontents) { //デモコンテンツを使用しない場合、デモコンテンツのファイルを削除
    let templateList = [];
    const contentMD = "---\n\
layout: article.ejs\n\
title: コンテンツタイトル\n\
date: 2018-11-22T23:30:00+09:00\n\
thumbnail: eyecatch.jpg\n\
excerpt: 記事の概要です\n\
---\n\
\n\
### 記事タイトル\n\
\n\
記事はMarkdown記法で記述できます。記事のファイル名は数字で作成順にしてください。\n\
\n\
### 先頭の---で区切られた部分について\n\
\n\
先頭の`---`で区切られた部分はタイトルや更新日時、記事ページのテンプレートを指定するメタ情報を含む部分となっています。\n";
    //全てのmdファイルを削除
    rimraf(`${dir.contents.dir}/*.md`, ()=> {
        //サンプル記事追加
        fs.writeFileSync(`${dir.contents.dir}/1.md`, contentMD);
    });
    //オリジナルのejsファイルを削除した上でテンプレートファイルをコピー
    const layout = "layout/";
    rimraf(`${dir.src.ejs}/*.ejs`, ()=> {
        //_template-*.ejsファイルの一覧を取得
        fs.readdirSync(`${direc}${layout}`, (err, files) => {
            if (err) throw err;
            files.filter((file) => {
                return fs.statSync(file).isFile() && /.*\.ejs$/.test(file);
            });
        }).forEach((file) => {
            fs.copyFile(`${direc}${layout}${file}`, `${dir.src.ejs}/${file}`, (err) => {
                if (err) throw err;
            });
        });
    });
    //オリジナルの_header.ejsファイルを削除した上でテンプレートファイルをコピー
    const partial = "partial/";
    rimraf(`${dir.src.ejs}/${partial}_header.ejs`, ()=> {
        fs.copyFile(`${direc}${partial}_header.ejs`, `${dir.src.ejs}/${partial}_header.ejs`, (err) => {
            if (err) throw err;
        });
    });
}