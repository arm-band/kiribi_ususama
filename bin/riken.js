const dir          = require('../gulp/dir')
const functions    = require('../gulp/functions')
const fs           = require('fs')
const path         = require('path')
const rimraf       = require('rimraf')
const runAll = require('npm-run-all')

const plugins = functions.getConfig(dir.config.plugins)
const pluginsStr = '_plugins'
const keyStrSG = 'styleguide'
const keyStrLB = 'lightbox'
const keyStrSlick = 'slick'

/* functions */
const isExistFile = (file) => {
    try {
        fs.statSync(file)
        return true
    } catch(err) {
        if(err.code === 'ENOENT') return false
    }
}

/* JS file generate */
const pluginJsPath = path.join(dir.src.js, pluginsStr)
const jsPath = path.join(pluginJsPath, `${pluginsStr}.js`)
if(isExistFile(jsPath)) {
    rimraf(jsPath, () => {
        let pluginCode = ''
        Object.keys(plugins).forEach(function(key) {
            const val = this[key]
            const pluginFile = path.join(path.join(pluginJsPath, key), `${key}.js`)
            if(val && isExistFile(pluginFile)) {
                pluginCode += `${fs.readFileSync(pluginFile, 'utf8')}\n`
            }
        }, plugins)
        fs.writeFileSync(jsPath, pluginCode, (err) => {
            if(err) console.log(err)
        })
    })
}
/* Scss file generate */
const pluginScssPath = path.join(dir.src.scss, pluginsStr)
const scssPath = path.join(pluginScssPath, `${pluginsStr}.scss`)
if(isExistFile(scssPath)) {
    rimraf(scssPath, () => {
        let pluginCode = ''
        Object.keys(plugins).forEach(function(key) {
            const val = this[key]
            const pluginFile = path.join(path.join(pluginScssPath, key), `_${key}.scss`)
            if(val) {
                if(isExistFile(pluginFile)) {
                    pluginCode += `@import "${pluginsStr}/${key}/${key}";\n`
                }
                else if(key === keyStrSG) { //styleguide
                    pluginCode += `@import "${pluginsStr}/styleguide/sg_index";
@import "${pluginsStr}/styleguide/sg_news";
@import "${pluginsStr}/styleguide/sg_article";
`
                }
                else if(key === keyStrLB) {
                    const scssLBPath = 'assets/lightbox/lightbox.scss'
                    pluginCode += `@import "../${scssLBPath}";
`
                    runAll([`${keyStrLB}:*`], { parallel: true })
                        .then(() => {
                            console.log(`${keyStrLB} files copy: done!`)
                            let cssFile = `${fs.readFileSync('./node_modules/lightbox2/dist/css/lightbox.css', 'utf8')}\n`
                            cssFile = cssFile.replace(/images/g, 'img/lightbox') // images -> img/lightbox
                            fs.writeFileSync(`./src/scss/${scssLBPath}`, cssFile, (err) => {
                                if(err) console.log(err)
                            })
                        })
                        .catch(err => {
                            console.log(`${keyStrLB} files copy: failed!`)
                        })
                }
                else if(key === keyStrSlick) {
                    pluginCode += `@import "../../../node_modules/slick-carousel/slick/slick.scss";
@import "../../../node_modules/slick-carousel/slick/slick-theme.scss";
`
                    runAll([`${keyStrSlick}:*`], { parallel: true })
                        .then(() => {
                            console.log(`${keyStrSlick} files copy: done!`)
                        })
                        .catch(err => {
                            console.log(`${keyStrSlick} files copy: failed!`)
                        })
                }
            }
        }, plugins)
        fs.writeFileSync(scssPath, pluginCode, (err) => {
            if(err) console.log(err)
        })
    })
}