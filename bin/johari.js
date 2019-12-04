const dir          = require('../gulp/dir');
const fs           = require('fs');
const outputStr = 'httpリンク';

const htmlHttpWalk = (p, fileList) => {
    let files = fs.readdirSync(p);
    for(let i = 0; i < files.length; i++) {
        let path = p;
        if(!/.*\/$/.test(p)) {
            path += '/';
        }
        const fp = path + files[i];
        if(fs.statSync(fp).isDirectory()) {
            htmlHttpWalk(fp, fileList); //ディレクトリなら再帰
        } else {
            if(/.*\.html$/.test(fp)) {
                //ページ名
                const htmlStream = fs.readFileSync(fp, 'utf8');
                const lineArray = htmlStream.split(/(?:\r\n|\r|\n)/g);
                for(let j = 0; j < lineArray.length; j++) {
                    if(/(((?:src|href)=(?:\"))(.*?)(\"))/gi.test(lineArray[j])) { //titleタグを抽出
                        const hrefSrcStr = RegExp.$1;
                        if(/^http\:\/\/(.*?)/.test(RegExp.$3)) {
                            fileList.push({
                                'file': fp,
                                'errStr': hrefSrcStr
                            }); //HTMLファイルならコールバック発動
                        }
                    }
                }
            }
        }
    }
};

//リスト出力先の存在確認
try {
    fs.statSync(dir.dist.html);
} catch(err) {
    console.log(err);
    return false;
}
let fileList = [];
//探索
htmlHttpWalk(dir.dist.html, fileList);

//出力
if(fileList.length > 0) {
    console.log(`NG: ${outputStr}が存在します:`);
    console.log('');
    for(let i = 0; i < fileList.length; i++) {
        console.log(`${i}> ${fileList[i]['file']}: ${fileList[i]['errStr']}`);
    }
    console.log('');
}
else {
    console.log(`OK: ${outputStr}は存在しません`);
}
