const dir          = require('../gulp/dir');
const functions    = require('../gulp/functions');
const fs           = require('fs');
const path         = require('path');
const rimraf       = require('rimraf');
const runAll       = require('npm-run-all');

const plugins = functions.getConfig(dir.config.plugins);
const pluginsStr = '_plugins';
const keyStrLB = 'lightbox';
const keyStrSlick = 'slick';
const pluginJsPath = path.join(dir.src.js, pluginsStr);
const jsPath = path.join(pluginJsPath, `${pluginsStr}.js`);

/* functions */
const jsFileWrite = (jsPath) => {
    let pluginCode = '';
    let sxportCode = '';
    Object.keys(plugins).forEach(function(key) {
        const val = this[key];
        const pluginFile = `./${key}/${key}.js`;
        if(val) {
            if(functions.isExistFile(path.join(path.join(pluginJsPath, key), `${key}.js`))) {
                pluginCode += `import ${key} from '${pluginFile}';
`;
                sxportCode += `    ${key}: ${key},
`;
            }
            else if(key === keyStrLB) {
                pluginCode += `import lightbox from 'lightbox2/dist/js/lightbox.min.js';
`;
                sxportCode += `    ${key}: ${key},
`;
            }
        }
    }, plugins);
    const pluginsData = `${pluginCode}
export default {
${sxportCode}
};
`;
    fs.writeFileSync(jsPath, pluginsData, (err) => {
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
            if(key === keyStrLB) {
                pluginCode += `@use "./node_modules/lightbox2/dist/css/lightbox.css";
`;
                runAll([`${keyStrLB}:*`], { parallel: true })
                    .then(() => {
                        console.log(`${keyStrLB} files copy: done!`);
                    })
                    .catch((err) => {
                        console.log(`${keyStrLB} files copy: failed!`);
                    });
            }
            else if(key === keyStrSlick) {
                pluginCode += `@use "${pluginsStr}/us-${key}/us-${key}";
@use "../../../node_modules/slick-carousel/slick/slick.scss";
@use "../../../node_modules/slick-carousel/slick/slick-theme.scss";
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
                pluginCode += `@use "${pluginsStr}/${key}/${key}";\n`;
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
