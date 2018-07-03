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
console.log("os:" + bowser.ios + ", browser:" + bowser.safari);
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
    if($("#indexPage").length) { //トップページの場合のみ動作
        var navbarHeight = parseInt($("#indexPage").attr("data-offset"));
        var $navbar = $("#navbar");
        $navbar.find("a").on("click", function() {
            var speed = 1000;
            var href = $(this).attr("href");
            var target = $(href == "#" || href == "" ? "html" : href);
            var position = target.offset().top - navbarHeight;
            $("body, html").animate({ scrollTop:position }, speed, "easeInOutCirc");
            $navbar.find(".navbar-toggle[data-target=\"#navbarMenu\"]").click(); //移動したらハンバーガーを折りたたむ
            return false;
        });
    }
}