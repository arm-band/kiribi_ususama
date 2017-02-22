# My web template for gulp & ejs

自分用の小規模Webサイト制作用テンプレートです。  
主にデモやテストサイト用で、gulpとejs対応版。

## How to use?

使い方

### Preparement

事前に以下の準備が必要です。

- Sass(ruby)がインストール・設定済
- node.js(5以上)
    + npm
    + (gulp)
    + (ejs)

### Download

このテンプレートは以下のライブラリ・フレームワークの使用を前提としています。  
使用前にダウンロード等の準備をしてください。

- Bootstrapテーマ(日本語対応) ※Scss版 … ver3.3.7
- Font Awesome(CDN使用) … ver4.6.3
- scss
    + sns色一覧
    + 游ゴシック対応フォント指定
    + ハンバーガーメニューのアニメーション
        * Bootstrapテーマと計4つ./src/scss/assets/に入れる
- jQuery
    + jQuery(CDN使用) … ver3.1.0
    + jQuery Easy Easing … ver1.3
        * BootstrapとEasy Easingを./src/js/assets/に入れる

### Using

srcをダウンロードしてプロジェクトディレクトリにセットし、distディレクトリを作成したら、

    npm install --save-dev

で環境設定。

    gulp

で実行。browser-syncで既定のブラウザでページを表示します。

## Function

用意している機能

- now loading
- アイキャッチ(高さ100vh, 背景fixed) ※画像は適宜用意
- ページトップへ戻る
- ハンバーガーメニューのアニメーション

## Future

ejsの使い方をもっとしっかりしていきたい。

- 特にパンくずはテストの為に追加したので柔軟性に欠ける
- jsonから読み込めると楽そう

## Release

- 2017/2/22 ver1.0.0