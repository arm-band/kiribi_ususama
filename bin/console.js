/**
 * Ususama CLI
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */
var appName = "Ususama CLI";

//file operation
var fs = require("fs");
//入力待機
var readlineSync = require("readline-sync");

//path difinition
var dir = {
  data: {
    dir       : './src/data',
    variables : '/variables.json',
    news      : '/news.json',
    commonvar : '/commonvar.json'
  }
};

//jsonファイル取得
//ejs内で使用するパラメータ
var getVariables = () => {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.variables, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}
//新着情報
var getNews = () => {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.news, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}
//ejs, js, scssにまたがって使用するパラメータ
var getCommonVar = () => {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.commonvar, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}

//書き換えるパラメータと質問
var defaultStr = "!!DEFAULT!!";
var params = [
    {
        "q": `サイト名を入力してください。 (デフォルト: "${defaultStr}")\n ※ヘッダやトップページのアイキャッチに表示します。`,
        "p": "Kiribi Ususama"
    },
    {
        "q": `サイトの作者・著者情報を入力してください。 (デフォルト: "${defaultStr}")\n ※フッタのコピーライト表示に使います。`,
        "p": "アルム＝バンド"
    },
    {
        "q": `サイトの発行年数を西暦、半角数字4桁で入力してください。 (デフォルト: "${defaultStr}")\n ※フッタのコピーライト表示に使います。`,
        "p": "2018"
    },
    {
        "q": `サイトのドメインを http:// または https:// から始め、最後はスラッシュで終わる形で入力してください。 (デフォルト: "${defaultStr}")\n ※OGPの出力などに使います。`,
        "p": "https://github.com/arm-band/kiribi_ususama/"
    },
    {
        "q": `サイトのパスを / (ルートディレクトリ)から / で終わる形式で入力してください。 (デフォルト: "${defaultStr}")\n ※baseurl属性に使います。\n ※例) トップページのアドレスが https://example.com/ ならば「/」、https://example.com/hoge ならば「/hoge/」という形で入力してください。\n ※サイトがサブディレクトリ以下の場合は特に注意してください。`,
        "p": "/"
    },
    {
        "q": `サイトのメインカラーを # から始めて3桁か6桁で入力してください。(デフォルト: "${defaultStr}")\n ※メインカラーとして使用する他、theme-colorにも使います。\n ※メインカラーからサブカラーとアクセントカラーの2色をScssのadjust-hueで計算して自動設定します。`,
        "p": "#E46952"
    }
];
//エラー内容
var errMsg = [
    "jsonデータファイルの取得に失敗しました。\n",
    "jsonファイルの書き出しに失敗しました。\n"
];
var warnMsg = [
    "\n !! 必須項目です。文字列を入力してください。 !!\n",
    "\n !! 半角数字4桁ではありません。発行年数は、半角数字4桁で入力してください。 !!\n",
    "\n !! ドメインの入力は http:// または https:// から始めてください。また、最後はスラッシュを付けてください。 !!\n",
    "\n !! サイトのパスは / から始めてください。 !!\n",
    "\n !! 色の指定は # で始めてください。また、16進トリプレットで表記しください。 !!\n"
];

//オブジェクトがからかどうか判定する関数
//戻り値: empty: true, not empty: false
var isEmpty = (obj) => {
    for(let i in obj){
        return false;
    }
    return true;
}

//ダブルクォーテーションをエスケープ
var escDQ = (str) => {
    return str.replace(/"/g, '\"');
};

//ファイル書き込み(同期処理)
var fileWrite = (filepath, filename, data) => {
    fs.writeFileSync(filepath, JSON.stringify(data , false, "\t"));
    return filename;
}

//エラー終了させる関数
//errNum: エラー番号。エラーメッセージの配列errMsgのインデックスを指定、 opt: オプション。付随情報がある場合は記述
var errThorwer = (errNum, opt = "") => {
    console.log(`${errMsg[errNum]} (${opt})`);
    process.exit(errNum);
}

//最後の処理
var final = () => {
    console.log("正常に処理を完了しました。\n");
    process.exit(0);
}

//REPLの動作定義
//q: 表示させる質問文、str: 初期値の文字列、 cnt: 何問目か
var repl = (q, str, cnt) => {
    var flag = false; //条件を満たすか否か
    var input = ""; //入力値]
    var ques = q.replace(defaultStr, str);
    var quesStr = `${cnt + 1}. ${ques}`;
    //正しい入力がなされるまで繰り返す
    do {
        console.log(quesStr); //質問表示
        input = readlineSync.question(); //入力待ち
        //必須チェック
        if(input.length > 0) {
            if(cnt === 2) { //3問目、発行年数
                if(input.match(/^\d{4}$/)!=null) { //数字4桁か
                    flag = true;
                }
                else {
                    console.log(warnMsg[1]);
                }
            }
            else if(cnt === 3) { //4問目、ドメイン
                if(input.match(/^http(s)*:\/\//)!=null && input.match(/\/$/)!=null) { // http:// または https:// から始まるり、/で終わるか
                    flag = true;
                }
                else {
                    console.log(warnMsg[2]);
                }
            }
            else if(cnt === 4) { //4問目、パス
                if(input.match(/^\//)!=null && input.match(/\/$/)!=null) { // / から始まるり、 / で終わるか
                    flag = true;
                }
                else {
                    console.log(warnMsg[3]);
                }
            }
            else if(cnt === 5) { //6問目、色
                if(input.match(/^#[0-9A-Fa-f]{3}$/)!=null || input.match(/^#[0-9A-Fa-f]{6}$/)!=null) { //16進数3桁か6桁
                    flag = true;
                }
                else {
                    console.log(warnMsg[4]);
                }
            }
            else { //他の質問ならば、必須チェックのみ
                flag = true;
            }
        }
        else {
            console.log(warnMsg[0]);
        }
        console.log("");
    } while(!flag);
    return escDQ(input);
}

//メイン処理
var main = () => {
    //jsonの読み込み
    var variables = getVariables();
    var news = getNews();
    var commonVar = getCommonVar();

    //json読み取り判定
    if (isEmpty(variables) || isEmpty(news) || isEmpty(commonVar)) {
        var optMsg = "対象ファイル: ";
        if(isEmpty(variables)) {
            optMsg += "variable.json";
        }
        else if(isEmpty(news)) {
            optMsg += "news.json";
        }
        else if(isEmpty(commonVar)) {
            optMsg += "commonvar.json";
        }

        errThorwer(0, optMsg);
    }

    //成功した場合、処理続行
    console.log(`/* ================================== * `);
    console.log(` *                                    * `);
    console.log(` * ${appName}                        * `); //名称
    console.log(` * ${news.news[0].title}                    * `); //バージョン情報
    console.log(` *                                    * `);
    console.log(` * ================================== */`);
    console.log("");
    console.log(`サイトの初期設定を行うため、${params.length}個の質問を行います……`);
    console.log("");
    //質問と初期設定
    params.forEach((val, index, array) => {
        val.p = repl(val.q, val.p, index);
    });

    //最後まで到達したら、jsonを書き換える
    params.forEach((val, index, array) => {
        if(index === 0) {
            variables.commons.sitename = val.p;
        }
        else if (index === 1) {
            variables.commons.author = val.p;
        }
        else if (index === 2) {
            variables.commons.year = val.p;
        }
        else if (index === 3) {
            variables.commons.url = val.p;
        }
        else if (index === 4) {
            variables.commons.baseurl = val.p;
        }
        else if (index === 5) {
            commonVar["main-color"] = val.p;
        }
    });

    //ファイル書き出し
    var promise = Promise.resolve();
    promise
        .then(fileWrite(`${dir.data.dir}${dir.data.variables}`, "variables.json", variables))
        .then(fileWrite(`${dir.data.dir}${dir.data.commonvar}`, "commonvar.json", commonVar))
        .then(final())
        .catch(errThorwer(1, ` 対象ファイル: ${filename}`));
}

//実行
main();