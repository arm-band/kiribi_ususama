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

### Download

このテンプレートは以下のライブラリ・フレームワークの使用を前提としています。  
使用前にダウンロード等の準備をしてください。

- Font Awesome(CDN使用) … ver4.7.0
- scss(自前ソース。D:\xampp\htdocs\_lib\own-lib\ にpackage.jsonと共にファイル一式があるものと仮定)
    + sns色一覧
    + 游ゴシック対応フォント指定
    + ハンバーガーメニューのアニメーション

### Using

srcをダウンロードしてプロジェクトディレクトリにセットし、distディレクトリを作成したら、

    npm install --save-dev

で環境設定。

    npm run proinit

で初期設定を完了させます。その後に

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

どうせならばFont Awesomeも混ぜれば良かった。

## Release

- 2017/7/19 ver.1.1.2
    - フッタの微修正（scssファイル、ejsファイル）
- 2017/7/6  ver1.1.1
    - Font CDNのAwesomeを4.7.0にバージョンアップ
    - gulpfile.jsの記述を変更
        - BrowserSyncのreloadタスクを集約
        - open: 'external'を追加
- 2017/6/9  ver1.1.0
    - 後述パッケージをnpmで自動インストールするようにpackage.jsonを変更
        - Bootstrap + Honoka(3.3.7)
        - jQuery(3.2.1)
        - jQuery.easing(1.3)
        - 自前のコード（ローカルパスで指定）
    - これに合わせて、gulpfile.jsとscssの読み込み部分も変更
- 2017/2/22 ver1.0.0