const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const sass          = require('gulp-sass')(require('sass'));
const autoprefixer  = require('gulp-autoprefixer');
const sourcemaps    = require('gulp-sourcemaps');
const fs            = require('fs');
const dir           = require('../dir');
const functions     = require('../functions');
const dotenv        = require('dotenv').config();
const plugins = functions.getConfig(dir.config.plugins);

//scssコンパイルタスク
const scss = {
    yaml2sass: (done) => {
        const strOrigin = fs.readFileSync(dir.config.dir + dir.config.commonvar, 'utf8');
        let strDist = '';
        let strConvert = '';
        strConvert = strOrigin.replace(/\r/g, '');
        let strArray = strConvert.split("\n");
        for(let i = 0; i < strArray.length; i++) {
            if(!(i === strArray.length - 1 && strArray[i].length === 0)) { //最後の空行以外
                strDist += `$${strArray[i]};\n`;
            }
        }
        //カラーコード
        strDist = strDist.replace(/\"#([\da-fA-F]{6}|[\da-fA-F]{3})\"/g, function() {
            return arguments[0].replace(/\"/g, '');
        });
        //数値(+単位)
        strDist = strDist.replace(/\"[\d\.]+(rem|px|em|\%)?\"/g, function() {
            return arguments[0].replace(/\"/g, '');
        });
        fs.writeFileSync(`${dir.src.scss}/global/_var.scss`, strDist);
        done();
    },
    sass: () => {
        let ignoreListArray = [];
        if(!plugins.noscript) {
            ignoreListArray.push(`${dir.src.scss}/noscript.scss`);
        }
        let objGulp = src(
            `${dir.src.scss}/**/*.scss`,
            {
                ignore: ignoreListArray
            }
        );
        if(process.env.DEV_MODE === 'dev') {
            objGulp = objGulp.pipe(sourcemaps.init());
        }
        objGulp = objGulp
            .pipe(plumber({
                errorHandler: notify.onError({
                    message: 'Error: <%= error.message %>',
                    title: 'sass'
                })
            }))
            .pipe(sass.sync({
                outputStyle: 'compressed',
                quietDeps: true
            }).on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }));
            if(process.env.DEV_MODE === 'dev') {
                objGulp = objGulp.pipe(sourcemaps.write())
            }
            objGulp = objGulp.pipe(dest(dir.dist.css));
            return objGulp;
    }
};

module.exports = scss;
