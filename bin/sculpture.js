const _         = require('../gulp/plugin');
const dir       = require('../gulp/dir');
const functions = require('../gulp/functions');

const fileList = functions.getArticles(`${dir.contents.dir}/`, functions);
let counter = 0;
if(fileList !== null && fileList !== undefined && fileList.length >= 0) {
    counter = fileList.length + 1;
}
else {
    counter = 1;
}
const filename = counter;
const datetime = functions.formatDate('', '');

const contentMD = functions.newContents(datetime);
//記事追加
_.fs.writeFileSync(`${dir.contents.dir}/${filename}.md`, contentMD);