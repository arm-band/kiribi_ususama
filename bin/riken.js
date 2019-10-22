const dir          = require('../gulp/dir');
const functions    = require('../gulp/functions');
const fs           = require('fs');
const path         = require('path');
const rimraf       = require('rimraf');
const runAll       = require('npm-run-all');

const plugins = functions.getConfig(dir.config.plugins);
const pluginsStr = '_plugins';
const keyStrSG = 'styleguide';
const keyStrLB = 'lightbox';
const keyStrSlick = 'slick';

/* functions */
const jsFileWrite = (jsPath) => {
    let pluginCode = '';
    Object.keys(plugins).forEach(function(key) {
        const val = this[key];
        const pluginFile = path.join(path.join(pluginJsPath, key), `${key}.js`);
        if(val && functions.isExistFile(pluginFile)) {
            pluginCode += `${fs.readFileSync(pluginFile, 'utf8')}\n`;
        }
    }, plugins);
    fs.writeFileSync(jsPath, pluginCode, (err) => {
        if(err) {
            console.log(err);
        }
    });
};
const scssFileWrite = (scssPath) => {
    let pluginCode = '';
    Object.keys(plugins).forEach(function(key) {
        const val = this[key];
        const pluginFile = path.join(path.join(pluginScssPath, key), `_${key}.scss`);
        if(val) {
            if(key === keyStrSG) { //styleguide
                pluginCode += `@import "${pluginsStr}/styleguide/sg_index";
@import "${pluginsStr}/styleguide/sg_news";
@import "${pluginsStr}/styleguide/sg_article";
`;
            }
            else if(key === keyStrLB) {
                const scssLBPath = 'assets/lightbox/lightbox.scss';
                pluginCode += `@import "../${scssLBPath}";
`;
                runAll([`${keyStrLB}:*`], { parallel: true })
                    .then(() => {
                        console.log(`${keyStrLB} files copy: done!`);
                        let cssFile = `${fs.readFileSync('./node_modules/lightbox2/dist/css/lightbox.css', 'utf8')}\n`;
                        cssFile = cssFile.replace(/images/g, 'img/lightbox'); // images -> img/lightbox
                        fs.writeFileSync(`./src/scss/${scssLBPath}`, cssFile, (err) => {
                            if(err) {
                                console.log(err);
                            }
                        });
                    })
                    .catch((err) => {
                        console.log(`${keyStrLB} files copy: failed!`);
                    });
            }
            else if(key === keyStrSlick) {
                pluginCode += `@import "${pluginsStr}/${key}/${key}";
@import "../../../node_modules/slick-carousel/slick/slick.scss";
@import "../../../node_modules/slick-carousel/slick/slick-theme.scss";
`;
                runAll([`${keyStrSlick}:*`], { parallel: true })
                    .then(() => {
                        console.log(`${keyStrSlick} files copy: done!`);
                    })
                    .catch((err) => {
                        console.log(`${keyStrSlick} files copy: failed!`);
                    });
            }
            else if(functions.isExistFile(pluginFile)) {
                pluginCode += `@import "${pluginsStr}/${key}/${key}";\n`;
            }
        }
    }, plugins);
    fs.writeFileSync(scssPath, pluginCode, (err) => {
        if(err) {
            console.log(err);
        }
    });
}

/* JS file generate */
const pluginJsPath = path.join(dir.src.js, pluginsStr);
const jsPath = path.join(pluginJsPath, `${pluginsStr}.js`);
if(functions.isExistFile(jsPath)) {
    rimraf(jsPath, () => {
        jsFileWrite(jsPath);
    });
}
else {
    jsFileWrite(jsPath);
}
/* Scss file generate */
const pluginScssPath = path.join(dir.src.scss, pluginsStr);
const scssPath = path.join(pluginScssPath, `${pluginsStr}.scss`);
if(functions.isExistFile(scssPath)) {
    rimraf(scssPath, () => {
        scssFileWrite(scssPath);
    });
}
else {
    scssFileWrite(scssPath);
}