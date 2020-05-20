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
    if (typeof fixedanchor_js === 'function') {
        navbarHeight = fixedanchor_js();
    }
    //トップページの場合のみ動作
    if ($('#index').length) {
        const $navbar = $('#navbar');
        //ドロップダウンコンポーネントには反応しないように
        $navbar
            .find('.nav-item:not(.dropdown)')
            .find('a')
            .on('click', function () {
                const speed = 1000;
                let href = $(this).attr('href');
                let targetID = '';
                //hrefの値が「/」「./」「#」「」の場合
                if (/^(\.\/|\/)$|^(#)?$/.test(href)) {
                    targetID = 'html';
                }
                //hrefの値が「/#HOGE」「./#HOGE」「#HOGE」の場合
                else if (/^(\.\/|\/)#.+/.test(href)) {
                    targetID = href.slice(RegExp.$1.length); //正規表現の後方参照により"(\.\/|\/)"をRegExp.$1に格納、その文字列の長さを削除し、「#HOGE」だけの状態にして渡す
                } else {
                    targetID = href;
                }
                let $target = $(targetID);
                let position = Math.ceil($target.offset().top) - navbarHeight;
                $(screlm).animate({ scrollTop: position }, speed, 'easeInOutCirc');
                $navbar.find('.navbar-toggle[data-target="#navbarList"]').click(); //移動したらハンバーガーを折りたたむ
                return false;
            });
    }
    //一般
    //ナビゲーションバーは除く
    $('a[href^="#"]:not(.nav-link)').on('click', function () {
        const speed = 1000;
        let href = $(this).attr('href');
        let targetID = href === '#' || href === '' ? 'html' : href; //リンク先が#か空だったらhtmlに
        let $target = $(targetID);
        let position = $target.offset().top - navbarHeight;
        $(screlm).animate({ scrollTop: position }, speed, 'easeInOutCirc');
        return false;
    });
};

$(() => {
    //スクロール対象を取得
    const screlm = scrollElm();
    //ページトップへ戻る
    if (typeof pageTop === 'function') {
        pageTop(screlm);
    }

    //ページ内スクロール
    pageScroll(screlm);

    //slick
    if (typeof slickCarousel === 'function') {
        slickCarousel();
    }

    //search of list.js
    if ($('#sitesearch').length) {
        const options = {
            valueNames: ['searchTitle', 'searchText'],
        };
        const searchList = new List('listSearch', options);
        //hits
        searchList.on('searchComplete', function (a) {
            $('#hits').text(a.matchingItems.length);
        });
    }
});
