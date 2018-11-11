const _         = require("../plugin");
const dir       = require("../dir");
const randomjs  = require("../random");

_.gulp.task("initial", done => {
    const s = Date.now();
    const seed = "हूं";
    const yu = 10000000;
    const maitreya = 5670000000;
    const metteyya = 5760000000;
    const seedrandom = new randomjs(s, seed.codePointAt(0), seed.codePointAt(1), seed.codePointAt(2));
    const samaya = seedrandom.randInt(yu, maitreya);
    const random = new randomjs(samaya);

    const value = random.randInt(yu, metteyya);
    const yaku = `ichinen: ${s}\nseed: ${samaya}\nkey: ${value}`;
    _.fs.writeFileSync(`${dir.src.scss}/util/_var.scss`, yaku);
    done();
});