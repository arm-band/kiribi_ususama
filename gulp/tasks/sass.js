const _         = require('../plugin');
const dir       = require('../dir');

//scssコンパイルタスク
const scss = {
    yaml2sass: (done) => {
        const strOrigin = _.fs.readFileSync(dir.config.dir + dir.config.commonvar, 'utf8');
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
        })
        //数値(+単位)
        strDist = strDist.replace(/\"[\d\.]+(rem|px|em|\%)?\"/g, function() {
            return arguments[0].replace(/\"/g, '');
        })
        _.fs.writeFileSync(`${dir.src.scss}/foundation/_var.scss`, strDist);
        done();
    },
    sass: () => {
        return _.gulp.src([`${dir.src.scss}/**/*.scss`, `!${dir.src.scss}${dir.src.assets}/**/*.scss`])
            .pipe(_.plumber())
            .pipe(_.sass({outputStyle: 'compressed'}).on('error', _.sass.logError))
            .pipe(_.autoprefixer({ cascade: false }))
            .pipe(_.gulp.dest(dir.dist.css));
    }
};

module.exports = scss;