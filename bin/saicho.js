const yaml     = require('yaml');
const fs       = require('fs');
const dir      = require('../gulp/dir');
const randomjs = require('./discover');

const s = Date.now();
const bijaksara = 'हूं';
const yu = 10000000;
const maitreya = 5670000000;
const metteyya = 5760000000;
const bijaksararandom = new randomjs(s, bijaksara.codePointAt(0), bijaksara.codePointAt(1), bijaksara.codePointAt(2));
const samaya = bijaksararandom.randInt(yu, maitreya);
const random = new randomjs(samaya);

const value = random.randInt(yu, metteyya);
const kyozo = {
    ichinen: s,
    bijaksara: samaya,
    key: value
};
const yaku = yaml.stringify(kyozo);
fs.writeFileSync(`${dir.config.dir}${dir.config.hachizetsu}`, yaku);
