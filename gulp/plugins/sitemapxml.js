const _         = require('../plugin');
const dir       = require('../dir');
const functions = require('../functions');

const sitemapxml = (done) => {
    const config = functions.getConfig(dir.config.config);
    const filename = 'sitemap.xml';

    //リスト出力先の存在確認
    try {
        _.fs.statSync(dir.dist.html);
    } catch(err) {
        console.log(err);
        return false;
    }
    let fileList = [];
    //探索
    functions.htmlMtimeWalk(functions, dir.dist.html, fileList);
    let xmlList = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for(let i = 0; i < fileList.length; i++) {
        let domain = config.commons.url;
        if(domain.slice(-1) !== '/') {
            domain = `${domain}/`;
        }
        const url = `${domain}${fileList[i][0].replace(/^\.\/dist\//gi, '')}`;
        const dateObj = new Date(fileList[i][1]);
        const filemtime = `${dateObj.getFullYear()}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${('0' + dateObj.getDate()).slice(-2)}`;
        xmlList += `<url>
    <loc>${url}</loc>
    <lastmod>${filemtime}</lastmod>
</url>\n`;
    }
    xmlList += `</urlset>\n`;

    //書き出し
    _.fs.writeFileSync(`${dir.dist.html}/${filename}`, xmlList);

    done();
};

module.exports = sitemapxml;