import $ from 'jquery';
import 'bootstrap-honoka/dist/js/bootstrap.bundle';
import 'jquery.easing/jquery.easing';
import plugins from './_plugins/_plugins';

//ユーザーエージェントからスクロールを実行する対象を判定
const scrollElm = () => {
    if ('scrollingElement' in document) {
        return document.scrollingElement;
    }
    if (navigator.userAgent.indexOf('WebKit') !== -1) {
        return document.body;
    }
    return document.documentElement;
};

//ページ内スクロール
const pageScroll = (screlm) => {
    let navbarHeight = 0;
    if (typeof plugins.fixedanchor_js === 'function') {
        navbarHeight = plugins.fixedanchor_js();
    }
    //ナビゲーションバー
    const $navbar = $('#navbar');
    //ブランド名とドロップダウンコンポーネント以外のナビゲーションリスト
    $navbar.find('.navbar-brand, .nav-item:not(.dropdown) a, .dropdown-item').on('click', function (e) {
        const speed = 1000;
        const classFixedAnchor = 'fixed_anchor';
        const dataFixedAnchor = 'data-fixedanchor';
        let href = $(this).attr('href');
        let linkPath = '';
        let currentPath = '';
        let targetID = '';

        if (href.indexOf('//') !== -1) {
            //絶対パスのリンクの場合
            linkPath = href.slice(href.indexOf('//') + 1); //`href`の値を、最初の`//`以降(ドメイン名以降全て)の文字列とする
            currentPath = `${location.host}${location.pathname}`; //`location.host`はポート番号も含む
        } else {
            //相対パスのリンクの場合
            if (/^(\/)((.*)\.html)?/.test(href)) {
                //ルートディレクトリからの参照(`/ususama.html`または`/`)
                linkPath = RegExp.$2; //hrefの値を、最後の`/`以降(ドメインのルートディレクトリ以降)、`.html`までの文字列(アンカーやパラメータは除外)とする(正規表現の後方参照)
                currentPath = location.pathname.slice(location.pathname.lastIndexOf('/') + 1); //sliceに文字列の長さ以上の数値を与えると空文字列になるので今回はOK(想定は`/`のみの場合)
            } else {
                if (/^((\.\.\/)+)((.*)\.html)?/.test(href)) {
                    //先祖ディレクトリへの参照(`../ususama.html`や`../../../`)
                    linkPath = RegExp.$3; //hrefの値を、最後の`../`以降(戻りきった先祖ディレクトリ以降)、`.html`までの文字列(アンカーやパラメータは除外)とする(正規表現の後方参照)
                    currentPath = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
                    let currentDirectory = '';
                    let recursivePath = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
                    const parentLength = (RegExp.$1.match(/(\.\.\/)/g) || []).length;
                    for (let i = 0; i < parentLength; i++) {
                        currentDirectory = recursivePath.slice(0, recursivePath.lastIndexOf('/'));
                        currentDirectory = currentDirectory.slice(currentDirectory.lastIndexOf('/') + 1);
                        currentPath = `${currentDirectory}/${currentPath}`;
                        recursivePath = recursivePath.slice(0, recursivePath.lastIndexOf(currentDirectory));
                    }
                } else if (/^(\.\/)?(.*\/)$/.test(href)) {
                    //サブディレクトリ(下層ディレクトリ)への参照(`./contact/`, `contact/`など)
                    linkPath = RegExp.$2; //hrefの値を、最後の`/`までの文字列とする
                    const fullPath = location.pathname.slice(location.pathname.indexOf('/') + 1);
                    currentPath = fullPath;
                } else {
                    //現在ディレクトリへの参照(`./ususama.html`または`ususama.html`または`./kiribi/ususama.html`、 `./../`など先祖ディレクトリへの参照と混合することは考慮していない)
                    linkPath = href.slice(href.indexOf('/') + 1); //hrefの値を、最後の`/`以降(現在のディレクトリ以降)の文字列とする
                    if (href.indexOf('#') !== -1) {
                        //`href`の値にアンカーリンクを含む場合
                        linkPath = linkPath.split('#')[0]; //`.html`までの文字列(アンカーやパラメータは除外)に分解
                    }

                    const fullPath = location.pathname.slice(location.pathname.indexOf('/') + 1);
                    currentPath = fullPath;
                    let recursivePath = currentPath.slice(0, location.pathname.lastIndexOf('/'));
                    for (let i = 0; i < (fullPath.match(/(\/)/g) || []).length; i++) {
                        if (currentPath.indexOf(recursivePath.slice(0, recursivePath.indexOf('/'))) === 0) {
                            currentPath = currentPath.slice(recursivePath.indexOf('/') + 1);
                            recursivePath = recursivePath.slice(recursivePath.indexOf('/') + 1);
                        }
                    }
                }
            }
        }

        if (linkPath === currentPath) {
            //`linkPath`(`href`のリンク先、アンカーは除外)の値と`currentPath`(現在ページのURL)が同じ場合
            if (href.indexOf('#') !== -1) {
                //`href`の値にアンカーリンクを含む場合、アンカーリンクを抽出
                targetID = `#${href.split('#')[1]}`;
            } else {
                //アンカーリンクがない場合は`html`タグをターゲットにする
                targetID = 'html';
            }
            let $target = $(targetID);
            let position = Math.ceil($target.offset().top);
            //$targetがクラス`fixed_anchor`を持っていない場合は差し引きを調整する
            if (!$target.hasClass(classFixedAnchor) || $('body').attr(dataFixedAnchor) === 'false') {
                position = position - navbarHeight;
            }
            $(screlm).animate({ scrollTop: position }, speed, 'easeInOutCirc');
            const navBarListID = 'navbarList';
            if ($(e.currentTarget).closest('#' + navBarListID).length > 0) {
                let breakpoint = 0;
                if (/(^|\s)navbar-expand-(\S*)/g.test($navbar.children('.navbar').prop('class'))) {
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
                        default:
                            breakpoint = 0;
                            break;
                    }
                }
                //ナビゲーションバー
                if ($(window).outerWidth() < breakpoint && !$navbar.find('.navbar-toggler[data-target="#' + navBarListID + '"]').hasClass('collapsed')) {
                    //現在の表示がハンバーガーメニューの場合
                    $navbar.find('.navbar-toggler[data-target="#' + navBarListID + '"]').trigger('click'); //移動したらハンバーガーを折りたたむ
                } else if ($(e.currentTarget).hasClass('dropdown-item') && $(e.currentTarget).closest('.dropdown').hasClass('show')) {
                    //現在の表示がハンバーガーメニューではなく、ドロップダウン内のメニューをクリックした場合
                    $(e.currentTarget).closest('.dropdown').trigger('click'); //移動したらドロップダウンを折りたたむ
                }
            }
            return false;
        } else {
            //`href`の値とリンク先のURLが異なる場合は、通常のaタグの動作に戻す
            return true;
        }
    });

    //一般
    //ナビゲーションバーは除く
    $('a[href^="#"]:not(.nav-link)').on('click', function () {
        const speed = 1000;
        const classFixedAnchor = 'fixed_anchor';
        const dataFixedAnchor = 'data-fixedanchor';
        let href = $(this).attr('href');
        let targetID = href === '#' || href === '' ? 'html' : href; //リンク先が#か空だったらhtmlに
        let $target = $(targetID);
        let position = Math.ceil($target.offset().top);
        //$targetがクラス`fixed_anchor`を持っていない場合は差し引きを調整する
        if (!$target.hasClass(classFixedAnchor) || $('body').attr(dataFixedAnchor) === 'false') {
            position = position - navbarHeight;
        }
        $(screlm).animate({ scrollTop: position }, speed, 'easeInOutCirc');
        return false;
    });
};

$(() => {
    //iPhone・iPad背景画像バグ対処
    if (typeof plugins.ios === 'function') {
        plugins.ios();
    }

    //スクロール対象を取得
    const screlm = scrollElm();
    //ページトップへ戻る
    if (typeof plugins.pagetop === 'function') {
        plugins.pagetop(screlm);
    }

    //ページ内スクロール
    pageScroll(screlm);

    //slick
    if (typeof plugins.slick === 'function') {
        plugins.slick();
    }

    //search of list.js
    if (typeof plugins.sitesearch === 'function') {
        plugins.sitesearch();
    }
});
