const _         = require('./plugin')
const dir       = require('./dir')

module.exports = {
    rssFeed: (config, functions) => { //RSS Feed
        const datetime = functions.formatDate('', '')
        const feed = new _.RSS({
            title: config.commons.sitename,
            description: config.commons.description,
            feed_url: config.commons.url + 'rss.xml',
            site_url: config.commons.url,
            image_url: config.commons.url + config.param.ogp.ogpimage,
            managingEditor: config.commons.author,
            webMaster: config.commons.author,
            copyright: config.commons.year + ' ' + config.commons.author,
            language: 'ja',
            pubDate: datetime,
            ttl: '60'
        })
        return feed
    },
    feedItem: (feed, config, attributes, functions) => {
        feed.item({
            title:  attributes.title,
            description: attributes.excerpt,
            url: config.commons.url + 'news/articles/' + functions.articleURL(attributes, functions) + '.html',
            author: config.commons.author,
            date: String(attributes.date)
        })
        return feed
    },
    getConfig: (ymlFile, path = dir.config.dir) => { //yamlファイル取得
        const file = _.fs.readFileSync(path + ymlFile, 'utf8')
        return _.yaml.parse(file)
    },
    getArticles: (directory, functions) => { //記事一覧をファイル名降順で取得
        let fileList = _.fs.readdirSync(directory)
        //ファイル名(拡張子なし)でソート
        fileList = fileList.map(fn => {
            return {
                fn: fn,
                noex: functions.zeroPadding(parseInt(fn.split('.')[0]))
            }
        })
        return fileList.sort((a, b) => b.noex - a.noex)
    },
    articleURL: (attributes, functions) => { //記事ページのURLを生成
        let urlTitle = attributes.url
        urlTitle = urlTitle.replace(/\./g, '_')
        const datetime = functions.formatDate(attributes.date, 'ymd')
        const url = `${urlTitle}-${datetime}`
        return url
    },
    zeroPadding: (num) => { //記事一覧を数字で管理すると桁数が異なるときに人間的な順番と機械的な順番が異なってしまうのを防ぐためにゼロパディング
        const val = Math.abs(num) //絶対値に変換
        const length = val.toString().length //文字列に変換して長さを取得、桁数とする
        return (Array(length).join('0') + num).slice(-length)
    },
    formatDate: (dateObj, output) => { //日付のフォーマット
        let day
        if(String(dateObj).length > 0) {
            day = new Date(dateObj)
        }
        else {
            day = new Date()
        }
        const y = day.getFullYear()
        let m = day.getMonth() + 1
        let d = day.getDate()
        const hr = day.getHours()
        let mt = day.getMinutes()
        let sc = day.getSeconds()
        if (m < 10) {
            m = '0' + m
        }
        if (d < 10) {
            d = '0' + d
        }
        if (mt < 10) {
        mt = '0' + mt;
        }
        if (sc < 10) {
            sc = '0' + sc;
        }
        let datetime
        if(output === 'ymd') {
            datetime = `${y}${m}${d}`
        }
        else {
            datetime = y + '-' + m + '-' + d + 'T' + hr + ':' + mt + ':' + sc + '+09:00'
        }
        return datetime
    },
    formatString: (str) => {
        if(typeof str !== 'string') {
            if(typeof str === undefined || typeof str === null || JSON.stringify(str) === 'undefined' || JSON.stringify(str) === 'null') {
                return ''
            }
            return String(str)
        }
        return str
    },
    encrypt: (txt, key, functions) => {
        txt = functions.formatString(txt)
        if(txt.length === 0) {
            return txt
        }
        let ciph = _.crypto.createCipher('aes-256-cbc', key)
        ciph.update(txt, 'utf8', 'hex')
        return ciph.final('hex')
    },
    decrypt: (key, txt, functions) => {
        txt = functions.formatString(txt)
        if(txt.length === 0) {
            return txt
        }
        let deciph = _.crypto.createDecipher('aes-256-cbc', key)
        deciph.update(txt, 'hex', 'utf8')
        return deciph.final('utf8')
    },
    newContents(datetime) {
        return `---
layout: article.ejs
title: コンテンツタイトル
url: releasenote
date: ${datetime}
thumbnail: eyecatch.jpg
excerpt: 記事の概要です。トップページと新着情報一覧で出力されます。
---\n
### サンプル見出し\n
記事はMarkdown記法で記述できます。記事のファイル名は数字で作成順にしてください。\n
### 先頭の---で区切られた部分について\n
先頭の\`---\`で区切られた部分はタイトルや更新日時、記事ページのテンプレートを指定するメタ情報を含む部分となっています。\n`
    },
    htmlWalk(functions, p, fileList) {
        let files = _.fs.readdirSync(p)
        for(let i = 0; i < files.length; i++) {
            let path = p
            if(!/.*\/$/.test(p)) {
                path += '/'
            }
            const fp = path + files[i]
            if(_.fs.statSync(fp).isDirectory()) {
                functions.htmlWalk(functions, fp, fileList) //ディレクトリなら再帰
            } else {
                if(/.*\.html$/.test(fp)) {
                    const htmlStream = _.fs.readFileSync(fp, {encoding: 'utf-8'})
                    let pageTitle = fp.replace(/^\.\/dist\//gi, '') //標準はファイル名
                    if(/<title>(.*?)<\/title>/gi.test(htmlStream)) { //titleタグを抽出
                        pageTitle = RegExp.$1.split(' ')[0] //後方参照でtitleタグの中の文字列を参照し、半角スペースで分離、標準では「ページ名 | サイト名」の表記なので最初の要素のみ格納
                    }
                    fileList.push([fp, pageTitle]) //HTMLファイルならコールバック発動
                }
            }
        }
    },
    htmlMtimeWalk(functions, p, fileList) {
        let files = _.fs.readdirSync(p)
        for(let i = 0; i < files.length; i++) {
            let path = p
            if(!/.*\/$/.test(p)) {
                path += '/'
            }
            const fp = path + files[i]
            if(_.fs.statSync(fp).isDirectory()) {
                functions.htmlMtimeWalk(functions, fp, fileList) //ディレクトリなら再帰
            } else {
                if(/.*\.html$/.test(fp)) {
                    const mtime = _.fs.statSync(fp).mtime
                    fileList.push([fp, mtime]) //HTMLファイルならコールバック発動
                }
            }
        }
    },
    isExistFile(file) {
        try {
            _.fs.statSync(file)
            return true
        } catch(err) {
            if(err.code === 'ENOENT') return false
        }
    }
}