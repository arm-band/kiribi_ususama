import Swiper, { Navigation, Autoplay } from 'swiper';
Swiper.use([Autoplay]);

// init Swiper
export default () => {
    new Swiper('.swiper', {
        autoplay: {
            // 自動再生
            delay: 3000,
            // ユーザが操作した後自動再生をやめない
            disableOnInteraction: false,
            // マウスホバーしたら一時停止
            pauseOnMouseEnter: true,
        },
        // ループする
        loop: true,
        // 切替スピードは0.6秒
        speed: 600,
        // 前・次へのナビゲーションを用意
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // ナビゲーション用のモジュール読み込み
        modules: [
            Navigation,
        ],
    });
};
