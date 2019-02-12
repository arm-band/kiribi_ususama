const _         = require('../gulp/plugin')
const dir       = require('../gulp/dir')
const functions = require('../gulp/functions')

const fileList = functions.getArticles(`${dir.contents.dir}/`, functions)
let counter = 0
if(fileList !== null && fileList !== undefined && fileList.length >= 0) {
    counter = fileList.length + 1
}
const filename = counter
const datetime = functions.formatDate('', '')

fileList
const contentMD = `---
layout: article.ejs
title: 新規作成
url: releasenote
date: ${datetime}
thumbnail: 
excerpt: 新規作成コンテンツです。
---

### 新規作成

新規作成コンテンツです。`
//記事追加
_.fs.writeFileSync(`${dir.contents.dir}/${filename}.md`, contentMD)