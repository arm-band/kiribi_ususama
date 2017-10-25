$(function() {
    //iPhone・iPad背景画像バグ対処
    mobileSafariRequiem();
    
    //ページトップへ戻る
    pageTop();
});

//mobile Saffari対策
function mobileSafariRequiem() {
    var $eyeCatch = $(".eyecatch");
    var device = navigator.userAgent;
    if (device.indexOf("iPhone") !== -1 || device.indexOf("iPad") !== -1) {
        //iPhoneかiPadならば
        $eyeCatch.addClass("mobile_Safari");
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