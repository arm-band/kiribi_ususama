const fs           = require('fs');
const functions    = require('../gulp/functions');
const dir    = require('../gulp/dir');
const honokaPath = './node_modules/bootstrap-honoka/scss/honoka/';
const scssAssetsPath = '/bootstrap/honoka/';
const honokaFile = '_honoka.scss';

if(functions.isExistFile(`${honokaPath}${honokaFile}`) && !functions.isExistFile(`${dir.src.scss}${dir.src.scssassets}${scssAssetsPath}${honokaFile}`)) {
    fs.writeFileSync(`${dir.src.scss}${dir.src.scssassets}${scssAssetsPath}${honokaFile}`, fs.readFileSync(`${honokaPath}${honokaFile}`, 'utf8'), (err) => {
        if(err) {
            console.log(err);
        }
    });
}
