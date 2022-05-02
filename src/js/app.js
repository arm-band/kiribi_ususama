import 'bootstrap/dist/js/bootstrap.bundle';
import plugins from './_plugins/_plugins';

const hamburgerClose = (e) => {
    const navbar = document.querySelector('#navbar');
    const navBarListID = 'navbarList';
    if (
        typeof e.currentTarget.closest(`#${navBarListID}`) !== 'undefined'
         && e.currentTarget.closest(`#${navBarListID}`) !== null
    ) {
        let breakpoint = 0;
        if (/(^|\s)navbar-expand-(\S*)/g.test(navbar.className)) {
            switch (RegExp.$2) {
                case 'sm':
                    breakpoint = 576;
                    break;
                case 'md':
                    breakpoint = 768;
                    break;
                case 'lg':
                    breakpoint = 992;
                    break;
                case 'xl':
                    breakpoint = 1200;
                    break;
                case 'xxl':
                    breakpoint = 1400;
                    break;
                default:
                    breakpoint = 0;
                    break;
            }
        }
        if (window.innerWidth < breakpoint) {
            // ブレークポイント未満の幅のとき
            const navbarTogglers = navbar.querySelectorAll(`.navbar-toggler[data-bs-target="#${navBarListID}"]`);
            navbarTogglers.forEach((navbarToggler) => {
                if(!navbarToggler.classList.contains('collapsed')) {
                    // 現在の表示がハンバーガーメニューの場合、
                    // 移動したらハンバーガーを折りたたむ
                    navbarToggler.dispatchEvent(new Event('click'));
                }
                else if(
                    e.currentTarget.classList.contains('dropdown-item')
                     && e.currentTarget.closest('.dropdown').classList.contains('show')
                ) {
                    // 現在の表示がハンバーガーメニューではなく、ドロップダウン内のメニューをクリックした場合
                    // 移動したらドロップダウンを折りたたむ
                    e.currentTarget.closest('.dropdown').dispatchEvent(new Event('click'));
                }
            });
        }
    }
};

window.addEventListener('load', () => {
    //iPhone・iPad背景画像バグ対処
    if (typeof plugins.ios === 'function') {
        plugins.ios();
    }

    //ページトップへ戻る
    if (typeof plugins.pagetop === 'function') {
        new plugins.pagetop();
    }

    // ブランド名とドロップダウンコンポーネント 「以外」 のナビゲーションリスト
    const navLinks = document.querySelectorAll('.navbar-brand, .nav-item:not(.dropdown) a, .dropdown-item');
    navLinks.forEach((navLink) => {
        // 第二引数に hamburgerClose(navLink) のように関数を渡すと、関数の実行結果が渡されてしまうのでNG。名前だけにする。逆に e でイベントターゲットは拾えるので引数を与える必要はない
        navLink.addEventListener('click', hamburgerClose, false);
    });

    //swiper
    if (typeof plugins.swiper === 'function') {
        plugins.swiper();
    }

    // luminous lightbox
    if (typeof plugins.lightbox === 'function') {
        plugins.lightbox();
    }

    //search of list.js
    if (typeof plugins.sitesearch === 'function') {
        plugins.sitesearch();
    }
},
false);
