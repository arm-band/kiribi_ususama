const dir       = require('../gulp/dir');
const functions = require('../gulp/functions');
const fs        = require('fs');
const path      = require('path');
const rimraf    = require('rimraf');

const plugins = functions.getConfig(dir.config.plugins);
const pluginsStr = '_plugins';
const keyStrLB = 'lightbox';
const keyStrSwiper = 'swiper';
const pluginJsPath = path.join(dir.src.js, pluginsStr);
const jsPath = path.join(pluginJsPath, `${pluginsStr}.js`);

/* functions */
const jsFileWrite = (jsPath) => {
    let pluginCode = '';
    let exportCode = '';
    Object.keys(plugins).forEach(function(key) {
        const val = this[key];
        const pluginFile = `./${key}/${key}.js`;
        if(val) {
            if(functions.isExistFile(path.join(path.join(pluginJsPath, key), `${key}.js`))) {
                pluginCode += `import ${key} from '${pluginFile}';
`;
                exportCode += `    ${key}: ${key},
`;
            }
        }
    }, plugins);
    exportCode = exportCode.replace(/((\r)?\n){1}$/g, '');
    const pluginsData = `${pluginCode}
export default {
${exportCode}
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
                pluginCode += `@use "${pluginsStr}/us-${key}/us-${key}";
@use "node_modules/luminous-lightbox/dist/luminous-basic.css";
`;
            }
            else if(key === keyStrSwiper) {
                pluginCode += `@use "${pluginsStr}/us-${key}/us-${key}";
@use "node_modules/${key}/${key}";
@use "node_modules/${key}/modules/autoplay/autoplay";
@use "node_modules/${key}/modules/navigation/navigation";
`;
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
