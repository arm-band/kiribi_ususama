const _         = require("./plugin");
const dir       = require("./dir");

module.exports = {
    rssFeed: (config, functions) => { //RSS Feed
        const datetime = functions.formatDate("", "");
        const feed = new _.RSS({
            title: config.commons.sitename,
            description: config.commons.description,
            feed_url: config.commons.url + "rss.xml",
            site_url: config.commons.url,
            image_url: config.commons.url + config.commons.ogpimage,
            managingEditor: config.commons.author,
            webMaster: config.commons.author,
            copyright: config.commons.year + " " + config.commons.author,
            language: "ja",
            pubDate: datetime,
            ttl: "60"
        });
        return feed;
    },
    feedItem: (feed, config, attributes, functions) => {
        feed.item({
            title:  attributes.title,
            description: attributes.excerpt,
            url: config.commons.url + "news/articles/" + functions.articleURL(attributes, functions) + ".html",
            author: config.commons.author,
            date: String(attributes.date)
        });
        return feed;
    },
    getConfig: (ymlFile, path = dir.config.dir) => { //yamlファイル取得
        const file = _.fs.readFileSync(path + ymlFile, "utf8");
        return _.yaml.parse(file);
    },
    getArticles: (directory, functions) => { //記事一覧をファイル名降順で取得
        let fileList = _.fs.readdirSync(directory);
        //ファイル名(拡張子なし)でソート
        fileList = fileList.map(fn => {
            return {
                fn: fn,
                noex: functions.zeroPadding(parseInt(fn.split('.')[0]))
            }
        });
        return fileList.sort((a, b) => b.noex - a.noex);
    },
    articleURL: (attributes, functions) => { //記事ページのURLを生成
        let urlTitle = attributes.title;
        urlTitle = urlTitle.replace(/\./g, "_");
        const datetime = functions.formatDate(attributes.date, "ymd");
        const url = `releasenote_${urlTitle}-${datetime}`;
        return url;
    },
    zeroPadding: (num) => { //記事一覧を数字で管理すると桁数が異なるときに人間的な順番と機械的な順番が異なってしまうのを防ぐためにゼロパディング
        const val = Math.abs(num); //絶対値に変換
        const length = val.toString().length; //文字列に変換して長さを取得、桁数とする
        return (Array(length).join("0") + num).slice(-length);
    },
    formatDate: (dateObj, output) => { //日付のフォーマット
        let day;
        if(String(dateObj).length > 0) {
            day = new Date(dateObj);
        }
        else {
            day = new Date();
        }
        const y = day.getFullYear();
        let m = day.getMonth() + 1;
        let d = day.getDate();
        const hr = day.getHours();
        const mt = day.getMinutes();
        const sc = day.getSeconds();
        if (m < 10) {
            m = "0" + m;
        }
        if (d < 10) {
            d = "0" + d;
        }
        let datetime;
        if(output === "ymd") {
            datetime = `${y}${m}${d}`;
        }
        else {
            datetime = y + "-" + m + "-" + d + "T" + hr + ":" + mt + ":" + sc + "+09:00"
        }
        return datetime;
    },
    formatString: (str) => {
        if(typeof str !== "string") {
            if(typeof str === undefined || typeof str === null || JSON.stringify(str) === "undefined" || JSON.stringify(str) === "null") {
                return "";
            }
            return String(str);
        }
        return str;
    },
    encrypt: (txt, key, functions) => {
        txt = functions.formatString(txt);
        if(txt.length === 0) {
            return txt;
        }
        let ciph = _.crypto.createCipher("aes-256-cbc", key);
        ciph.update(txt, "utf8", "hex");
        return ciph.final("hex");
    },
    decrypt: (key, txt, functions) => {
        txt = functions.formatString(txt);
        if(txt.length === 0) {
            return txt;
        }
        let deciph = _.crypto.createDecipher("aes-256-cbc", key);
        deciph.update(txt, "hex", "utf8");
        return deciph.final("utf8");
    }
};