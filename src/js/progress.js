//progressタグ設定用
var progress = document.getElementsByTagName("progress")[0];
var percentage = document.getElementById("loadPercentage");
var percent = 0;
progress.max = 100;
progress.value = 0;

//表示遅延用タイマー
var timer1;
var timer2;

//ページ読み込み時から実行
$(function() {
	percentage.textContent = progress.textContent = percent + "/100";
	var h = $(window).height();

	//js無効の人がコンテンツを表示できないのは問題なので、ロード表示はcssではdisplay:noneにして、
	//このjsを読み込んで初めてロード表示display:block、本来のコンテンツdisplay:none、という動作をさせている
	$('#wraper').css('display', 'none');
//	$('header').css('display', 'none');
	$('#loading, #loadContent').height(h).css('display','block');

	//0.5秒おきに実行
	timer1 = setInterval(function() {
		//100/4までの値をランダムで進捗率にプラス
		progress.value += Math.random() * 25;
		//positionの値に100をかけるとパーセンテージが分かる
		percent = Math.floor(progress.position * 100);
		//進捗率が最大値に到達したら処理終了
		if (progress.value >= progress.max) {
			loadEnd();
		}
		//プログレスバーの横にパーセント表示し、progress要素の中身も同時に更新
		percentage.textContent = progress.textContent = percent + "/100";
	}, 500);

	//10秒たったら強制的にロード画面を非表示
	setTimeout('stopload()',100000);
});
 
//全ての読み込みが完了したら実行
//$(window).load(function () {
jQuery.event.add(window, 'load', function() { //全て（画像含む）の読み込み完了後に呼ばれる関数
	loadEnd();
});

//強制ロード非表示の処理
function stopload() {
	loadEnd();
}

//ロード画面を非表示にしてコンテンツを表示させる処理
function loadEnd() {
	clearInterval(timer1);
	//最大値に到達と設定
	progress.value = 100;
	percent = 100;
	percentage.textContent = progress.textContent = percent + "/100";

	//表示終了
	$('#loading').delay(300).fadeOut(600);
	$('#loadContent').delay(300).fadeOut(300);
	$('#wraper').css('display', 'block');
	clearInterval(timer2);
}