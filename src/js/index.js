$(function() {
    //iPhone・iPad背景画像バグ対処
    mobileSafariRequiem();

    //ページトップへ戻る
    pageTop();

    //ページ内スクロール
    pageScroll();

//    $.getJSON(jsonFile, {ts: new Date().getTime()}, function(data) {
//    }).done(function(data, status, xhr) {
//    }).fail(function(xhr, status, error) {
//	});
});

//mobile Saffari対策
function mobileSafariRequiem() {
    var $body = $("body");
    if (bowser.safari && bowser.ios) {
        //iPhoneかiPadならば
        $body.addClass("mobileSafari");
    }
}

//ページトップへ戻る
function pageTop() {
    var returnPageTop = $(".returnPageTop");

    var startPos = 0;
    $(window).on("scroll", function(){
        //スクロール距離が400pxより大きければページトップへ戻るボタンを表示
        var currentPos = $(this).scrollTop();
        if (currentPos > 400) {
            returnPageTop.fadeIn();
        } else {
            returnPageTop.fadeOut();
        }
    });

    //ページトップへスクロールして戻る
    returnPageTop.on("click", function () {
        $("body, html").animate({ scrollTop: 0 }, 1000, "easeInOutCirc");
        return false;
    });
}

//ページ内スクロール
function pageScroll() {
    if($("#index").length) { //トップページの場合のみ動作
        var navbarHeight = parseInt($("#index").attr("data-offset"));
        var $navbar = $("#navbar");
        $navbar.find("a").on("click", function() {
            var speed = 1000;
            var href = $(this).attr("href");
            var targetID = "";
            if(/^(\.\/|\/)$|^(#)?$/.test(href)) { //hrefの値が「/」「./」「#」「」の場合
                targetID = "html";
            }
            else if(/^(\.\/|\/)#.+/.test(href)) { //hrefの値が「/#HOGE」「./#HOGE」「#HOGE」の場合
                targetID = href.slice(RegExp.$1.length); //正規表現の後方参照により"(\.\/|\/)"をRegExp.$1に格納、その文字列の長さを削除し、「#HOGE」だけの状態にして渡す
            }
            else {
                targetID = href;
            }
            var target = $(targetID);
            var position = target.offset().top - navbarHeight;
            $("body, html").animate({ scrollTop:position }, speed, "easeInOutCirc");
            $navbar.find(".navbar-toggle[data-target=\"#navbarList\"]").click(); //移動したらハンバーガーを折りたたむ
            return false;
        });
    }
}