const copyfiles = require("copyfiles");
const rimraf    = require("rimraf");
const fs        = require("fs");
const dir       = require("../gulp/dir");
const functions = require("../gulp/functions");
const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions;
const direc = `${dir.src.ejs}/templates/`;

const templateGen = () => {
    return new Promise((resolve, reject) => {
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
            console.log(direc);
            //_template-*.ejsファイルの一覧を取得
            fs.readdirSync(direc, (err, files) => {
                console.log(files);
                if (err) throw err;
                templateList = files.filter((file) => {
                    var filePath = direc + file;
                    console.log(filePath);
                    return fs.statSync(filePath).isFile() && /_template_.*\.ejs$/.test(filePath);
                });
            });
            console.log(templateList);
            //オリジナルのejsファイルを削除した上で_template-*.ejsファイルごとにファイルコピーし、元のテンプレートファイルを削除
            rimraf(`${dir.src.ejs}/*.ejs`, ()=>{
                console.log(templateList);
                for(let i in templateList) {
                    const filename = templateList[i].split("-");
                    const distFileName = filename[filename.length - 1];
                    let path = `${dir.src.ejs}/`;
                    if(distFileName.indexOf("header") !== -1) {
                        path += "partial/";
                    }
                    path += `${distFileName}.html`;
                    copyfiles([templateList[i], path]);
                };
            });
            //全てのmdファイルを削除
            rimraf(`${dir.contents.dir}/*.md`, ()=>{
                //サンプル記事追加
                fs.writeFileSync(`${dir.contents.dir}/1.md`, contentMD);
            });
        }
        resolve();
    });
}
templateGen().then(() => { rimraf(direc, ()=>{}) }); //テンプレート生成後、テンプレートディレクトリ削除