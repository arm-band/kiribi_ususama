const fs        = require('fs');
const dir       = require('../gulp/dir');
const functions = require('../gulp/functions');

const fileList = functions.getArticles(`${dir.contents.dir}/`, functions);
let counter = 0;
if(fileList !== null && fileList !== undefined && fileList.length > 0) {
    counter = parseInt(fileList[0].noex) + 1;
}
else {
    counter = 1;
}
const filename = String(counter);
const datetime = functions.formatDate('', '');

const contentMD = functions.newContents(datetime, functions);
//記事追加
fs.writeFileSync(`${dir.contents.dir}/${filename}.md`, contentMD);
