module.exports = class seedrandom {
    constructor(seed = 88675123, xseed = 123456789, yseed = 362436069, zseed = 521288629) {
        this.x = xseed;
        this.y = yseed;
        this.z = zseed;
        this.w = seed;
    }
    rnd() {
        let t;
        t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }
    //min以上max以下の乱数を生成
    randInt(min, max) {
        const r = Math.abs(this.rnd());
        return min + (r % (max + 1 - min));
    }
};
