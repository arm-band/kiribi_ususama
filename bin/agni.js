const opener = require('opener');

const sleep = (t) => {
    return new Promise((rs, rj) => {
        setTimeout(() => {
            rs();
        }, t);
    });
};

console.log('5秒後に初期設定画面を開きます……');
console.log('もし読み込めない場合は、再度リロードをお願いします');
sleep(5000).then(() => {
    opener('http://localhost:3000/');
});
