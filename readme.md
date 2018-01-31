# ![Kiribi Ususama](https://github.com/arm-band/kiribi_ususama/blob/master/misc/img/kiribi_ususama.png)

## Abstract

自分用の小規模Webサイト制作用テンプレートです。

Scss, ejs, gulp使用。

## How to use?

使い方

### Preparement

事前に以下の準備が必要です。

- node.js(7.2.1以上)
    - npm: 以下のライブラリを使用します(主なもののみ記載)
        - browser-sync: 2.18.13
        - gulp: 3.9.1
        - gulp-ejs: 3.0.1
        - gulp-sass: 3.1.0
        - gulp-autoprefixer: 4.1.0
        - bootstrap-sass: 3.3.7
        - bootstrap-honoka: 3.3.7-a
        - jquery: 3.2.1
        - jquery-easing: 1.4.1

### Download

このテンプレートは以下のライブラリ・フレームワークの使用を前提としています。  
使用前にダウンロード等の準備をしてください。

- Font Awesome(CDN使用) … ver4.7.0
- Scss(自前ソース。`<XAMPP_PATH>\_lib\own-lib\` に`package.json`と共にファイル一式があるものと仮定)
    - sns色一覧
    - 游ゴシック対応フォント指定
    - ハンバーガーメニューのアニメーション
    - etc.

### Using

1. `git clone <REPOSITORY_TEMPLATE_URL.git>`でリポジトリのクローンを作成
2. リポジトリ名でディレクトリが作成されるので、ディレクトリ名をプロジェクト名に変更
3. `git clone`するとリモートリポジトリがテンプレート元のパスのままなので、変更する
    1. `git remote rm origin <REPOSITORY_TEMPLATE_URL.git>`で現在のリモートリポジトリを削除
    2. `git remote add origin <REPOSITORY_PROJECT_URL.git>`でプロジェクトのリモートリポジトリを追加
4. `npm install --save-dev`で必要なプラグインを揃える
5. `npm run proinit`で初期設定を行う
6. `gulp`で実行。browser-syncにより、既定のブラウザでページを表示します

## Function1

gulpで処理されるもの

- ejs → htmlへの変換(`/src/ejs/*.ejs`→`/dist/*.html`) ※自動生成
- Scss → cssへの変換(`/src/scss/*.scss`→`/dist/css/*.css`) ※自動生成。minifyされたものを生成。
- jsの圧縮(`/src/js/*.js`→`/dist/js/*.min.js`) ※自動生成。1つのファイルでminifyされます。
- 画像の圧縮(`/src/img/*`→`/dist/img/*.`) ※自動生成

## Function2

テンプレートが用意している機能

- Now Loading
- アイキャッチ(高さ100vh, 背景fixed) ※画像は適宜用意
- ページトップへ戻る
- ハンバーガーメニューのアニメーション(1～8まで)
- `src/ejs/news/news.json`による新着情報一覧の一元管理(トップページ: `index.ejs`と新着情報一覧: `news.ejs`の2箇所で使用)

## Future

ejsの使い方をもっとしっかりしていきたい。

- 特にパンくずはテストの為に追加したので柔軟性に欠ける

<del>どうせならばFont Awesomeも混ぜれば良かった。</del>

## Release

- 2018/1/31 ver.2.4.2
    - 新着情報周りを微調整
        - トップページに出力する件数を5件(変数で変更可)に制限
        - 上記の伴い、リンクボタンを追加
        - `news.html`の表示を微調整
- 2018/1/31 ver.2.4.1
    - スタイルガイド生成用に設定を追加
- 2018/1/30 ver.2.4.0
    - `gulp-frontnote`でスタイルガイドを生成するように加筆(β版)
    - jQuery Easingの参照元を変更
- 2018/1/30 ver.2.3.1
    - jsonを更新した際もbrowser-syncがリロードするように変更
- 2018/1/24 ver.2.3.0
    - jsonによるパラメータ管理機能を追加
        - `/src/ejs/news/news.json`というjsonファイルで新着情報をトップページと更新履歴一覧ページに異なるhtmlで出力するサンプルを追加
        - `/src/ejs/common/_var.ejs`で管理していた共通パラメータをjsonファイル(`/src/ejs/common/_var.json`)に変更
    - ejsの変数の指定をチェーン方式に変更
    - `.gitignore`追加
- 2018/01/17 ver.2.2.1
    - 各種微調整
- 2018/01/02 ver.2.2.0
    - `gulp-autoprefixer`追加
- 2018/01/02 ver.2.1.0
    - `gulp-ruby-sass`から`gulp-sass`にsassコンパイラを変更。rubyから脱却
- 2018/01/02 ver.2.0.0
    - 名前を付けました
    - 各種微調整
- 2017/12/22 ver.1.3.3
    - Bootstrapキャンセラーに追記
- 2017/12/05 ver.1.3.2
    - Bootstrapキャンセラーに追記
- 2017/11/16 ver.1.3.1
    - Bootstrapでいつも気になる指定をキャンセルするscssを追加
- 2017/10/18 ver.1.3.0
    - キービジュアルのmobileSafari対策が不十分だったのを修正
- 2017/10/18 ver.1.2.0
    - onw-libの中に丸ゴシックの記述を追加
- 2017/10/18 ver.1.1.3
    - npmのプラグインのバージョン更新
        - gulp-uglifyのコメントを残す方法が変化したらしい(参考: [gulp\-uglifyでコメントを残す方法が変わったの？ \- Qiita](https://qiita.com/tawatawa/items/515d8a58299b6dcd18f6))ので、gulpfile.jsを微修正
    - HonokaをGithubからnpm経由に変更
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