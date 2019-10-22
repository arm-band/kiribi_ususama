//ページトップへ戻る
const pageTop = (screlm) => {
    const $returnPageTop = $(".returnPageTop");

    $(window).on("scroll", function() {
        //スクロール距離が400pxより大きければページトップへ戻るボタンを表示
        let currentPos = $(this).scrollTop();
        if (currentPos > 400) {
            $returnPageTop.fadeIn();
        } else {
            $returnPageTop.fadeOut();
        }
    });

    //ページトップへスクロールして戻る
    $returnPageTop.on("click", function() {
        $(screlm).animate({ scrollTop: 0 }, 1000, "easeInOutCirc");
        return false;
    });
};