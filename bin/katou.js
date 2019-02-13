const rimraf    = require('rimraf')
const fs        = require('fs')
const dir       = require('../gulp/dir')
const functions = require('../gulp/functions')
const gulpConfig = functions.getConfig(dir.config.gulpconfig).functions
const direc = `${dir.template.dir}/`

const datetime = functions.formatDate('', '')
if(!gulpConfig.firstlock) { //初回設定ページ表示時のみ動作
    if(!gulpConfig.democontents) { //デモコンテンツを使用しない場合、デモコンテンツのファイルを削除
        let templateList = []
        const contentMD = functions.firstContents(datetime)
        //全てのmdファイルを削除
        rimraf(`${dir.contents.dir}/*.md`, ()=> {
            //サンプル記事追加
            fs.writeFileSync(`${dir.contents.dir}/1.md`, contentMD)
        })
        //オリジナルのejsファイルを削除した上でテンプレートファイルをコピー
        const layout = 'layout/'
        rimraf(`${dir.src.ejs}/*.ejs`, ()=> {
            //_template-*.ejsファイルの一覧を取得
            fs.readdirSync(`${direc}${layout}`, (err, files) => {
                if (err) throw err
                files.filter((file) => {
                    return fs.statSync(file).isFile() && /.*\.ejs$/.test(file)
                })
            }).forEach((file) => {
                fs.copyFile(`${direc}${layout}${file}`, `${dir.src.ejs}/${file}`, (err) => {
                    if (err) throw err
                })
            })
        })
        //オリジナルの_header.ejsファイルを削除した上でテンプレートファイルをコピー
        const partial = 'partial/'
        rimraf(`${dir.src.ejs}/${partial}_header.ejs`, ()=> {
            fs.copyFile(`${direc}${partial}_header.ejs`, `${dir.src.ejs}/${partial}_header.ejs`, (err) => {
                if (err) throw err
            })
        })
    }
}