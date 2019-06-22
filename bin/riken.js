const dir          = require('../gulp/dir')
const functions    = require('../gulp/functions')
const fs           = require('fs')
const path         = require('path')
const rimraf       = require('rimraf')

const plugins = functions.getConfig(dir.config.plugins)
const pluginsStr = '_plugins'

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
                else if(key === 'styleguide') { //styleguide
                    pluginCode += `@import "${pluginsStr}/styleguide/sg_index";
@import "${pluginsStr}/styleguide/sg_news";
@import "${pluginsStr}/styleguide/sg_article";
`
                }
            }
        }, plugins)
        fs.writeFileSync(scssPath, pluginCode, (err) => {
            if(err) console.log(err)
        })
    })
}