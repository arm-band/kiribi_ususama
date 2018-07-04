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
        - bootstrap: **4.0.0**
        - bootstrap-honoka: **4.0.0**
        - jquery: 3.2.1
        - jquery.easing: 1.4.1

### Download

このテンプレートは上記の他に以下のライブラリ・フレームワークの使用を前提としています。

- Font Awesome(CDN使用) … ver4.7.0

### Using

1. `git clone <REPOSITORY_TEMPLATE_URL.git>`でリポジトリのクローンを作成
2. リポジトリ名でディレクトリが作成されるので、ディレクトリ名をプロジェクト名に変更
3. `git clone`するとリモートリポジトリがテンプレート元のパスのままなので、変更する
    1. `git remote rm origin <REPOSITORY_TEMPLATE_URL.git>`で現在のリモートリポジトリを削除
    2. `git remote add origin <REPOSITORY_PROJECT_URL.git>`でプロジェクトのリモートリポジトリを追加
4. `npm i -D`(`npm install --save-dev`のショートカット)で必要なプラグインを揃える
5. `npm run ususama`(`npm run proinit`でも良い)で初期設定を行う
    - `npm run gue`ではなくなったので注意
6. `gulp`で実行。browser-syncにより、既定のブラウザでページを表示します

## Functions1

gulpで処理されるもの

- ejs → htmlへの変換(`/src/ejs/*.ejs`→`/dist/*.html`)
    - 自動生成
- Scss → cssへの変換(`/src/scss/*.scss`→`/dist/css/*.css`)
    - 自動生成
        - minifyされたものを生成
    - 自動でプレフィックスを付与
        - 基本最新2バージョン
        - `iOS >= 8.1`
        - `Android >= 4.4`
- jsの圧縮(`/src/js/*.js`→`/dist/js/*.min.js`)
    - 自動生成
        - 1つのファイルにminify
- 画像の圧縮(`/src/img/*`→`/dist/img/*`)
    - 自動生成

## Functions2

テンプレートが用意している機能

- Now Loading
- アイキャッチ(高さ100vh, 背景fixed) ※画像は適宜用意
- ページトップへ戻る
- <del>ハンバーガーメニューのアニメーション(1～8まで)</del>
- `src/ejs/news/news.json`による新着情報一覧の一元管理(トップページ: `index.ejs`と新着情報一覧: `news.ejs`の2箇所で使用)

## Futures

ejsの使い方をもっとしっかりしていきたい。

- 特にパンくずはテストの為に追加したので柔軟性に欠ける

<del>どうせならばFont Awesomeも混ぜれば良かった。</del>

## Settings

- jsonファイル
    - `variables.json`
        - `commons`:
            - `sitename`: サイト名。タイトルタグやトップページのアイキャッチ、ヘッダのブランド、フッタのコピーライトなど各所に使われます
            - `year`: 年数。フッタのコピーライトで使います
            - `author`: 作者名。フッタのコピーライトで使います
            - `baseurl`: `base`タグの`href`属性に使います
            - `ogpurl`: Twitterカード出力時のサイトURLを指定します
            - `ogpimage`: Twitterカード出力時の画像を指定します
            - `twitteraccount`: Twitterカード出力時のTwitterアカウントを指定します(@マーク抜き)
        - `color`:
            - `main`: メインカラー。アドレスバーの色を指定するテーマカラーで使います
        - `param`:
            - キー名はファイル名と合わせること
                - `title`: ページ名
                - `entitle`: 英語のページ名
                - `css`: 読み込むcssファイルのファイル名。拡張子不要
                - `js`: 読み込むjsファイルのファイル名。拡張子不要
                - `description`: `<meta description="">`に記述される説明
                - `ogpimage`: Twitterカード出力時の画像を指定します
                - `newscount`: `index.ejs`のみ存在。新着情報一覧で出力する新着情報の件数
    - `news.json`
        - 各項目: 新着情報の出力で使います
        - 末尾の`pagination`: `news<ページ数>.html`の各ページで出力する新着情報の件数
        - ※`news.ejs`1つから設定項目に応じて、1～複数ページの`news<ページ数>.html`が`/dist/news/`に生成されます
    - `commonvar.json`
        - 色、ナビゲーションバーの高さなど、基本的な情報をjson形式で記述
        - このjsonからscssの各所で使用している変数の元となる`/src/base/_var.scss`が生成される
        - ※既定で記述されているものはscssやejsで使用しているため、消さないこと
            - `main-color`: scssの他、`/src/ejs/partial/head.ejs`の`meta`タグ、`theme-color`属性の指定で使用
            - `/src/ejs/partial/header.ejs`の六角形svgの指定にも使用(通常はコメントアウト)
            - `navbar-height`: scssの他、`/src/ejs/index.ejs`の`body`タグに`data-offset`属性を指定するために使用
                - `/src/js/index.js`では上記bodyタグの`data-offset`属性を読み取ってスクロールダウンのオフセット値として使用

## Notes

3.0.0以降のバージョン番号について

`3.0.0-4.0.0`

- ハイフンより前は独自のバージョン
- ハイフン以降はHonokaのバージョン

## Release Notes

- 2018/7/4 ver.3.0.0-4.0.0
    - [Honoka](http://honokak.osaka/)のバージョンアップ(3.3.7→4.0.0)に対応
        1. ナビゲーションバーの高さ変更
        2. ハンバーガーアニメーションが死んだ
        3. 游ゴシック・游明朝を非使用に
        4. パネルコンポーネントからカードコンポーネントに変更
- 2018/7/3 ver.2.8.1
    - `main`タグに付与するIDとclassをファイル名から切り抜く処理がOSごとのパス文字で上手く動かない場合があるので対処
- 2018/7/3 ver.2.8.0
    - [bowser](https://www.npmjs.com/package/bowser)を使ってモバイルSafari判定を行い、`body`タグにクラスを付与するように変更しました
- 2018/6/29 ver.2.7.8
    - パスを`baseurl`に従って修正し、スクロールアニメーションが死なないようにパスなどを再調整
- 2018/5/30 ver.2.7.7
    - scssの微調整
- 2018/5/17 ver.2.7.6
    - npmのプラグインのバージョン更新
- 2018/4/29 ver.2.7.5
    - `baseurl`追加に伴う調整
        - articleのパスを`articles/`から`news/articles/`に変更し、画像パスも対応することを確認
        - `hierarchy`パラメータ削除
- 2018/4/28 ver.2.7.4
    - `baseurl`を追加し、各種パスをルートからの絶対パスで記述しなおしました
- 2018/3/26 ver.2.7.0
    - 各記事を1つのhtmlとして出力するように改修しました
        - 各記事をOGPに対応しました
    - `\s`だと半角スペースも取り除いてしまい、クラス付与などの状況でおかしくなるので取り除く特殊文字を`\r|\n|\t`に限定
- 2018/3/12 ver.2.6.8
    - OGPに仮対応しました
- 2018/3/9 ver.2.6.7
    - jsonデータで改行を許すように、
        1. ファイルリードしたデータをエンコードし、
        2. パース前に半角スペース・タブ・改行を除去する
    - 処理を`gulpfile.js`に追記。
- 2018/3/5 ver.2.6.6
    - Frontnote周りを改修
        - 出力先パスを変更
        - Frontnote関連のコードを`sg/src/`ディレクトリにまとめた
        - テンプレートを作成。`commonVar.json`のキーで"color"と入っているキーからカラーパレットを生成することで、疑似的に「scssの変数からカラーパレットを生成」を実現
        - スタイルガイド生成用のパーツは`src/scss/util/sg/`の下に分類
    - `src/scss/base/`の名前を`src/scss/util/`に変更
- 2018/3/5 ver.2.6.5
    - Frontnote用のキャンセラーを用意
- 2018/3/5 ver.2.6.4
    - タイポグラフィ整理。明朝体の指定でGoogle Fonts +のSawarabi Minchoを指定
- 2018/3/5 ver.2.6.3
    - タイポグラフィ整理
- 2018/3/5 ver.2.6.2
    - 脱自前ライブラリ化
- 2018/3/2 ver.2.6.1
    - トップページにスクロールスパイを追加。`body`の`data-offset`を取得するため、結果として`commonVar.json`の値を使いまわしている
    - 各ページの`body`タグにidを付与
    - favicon参照に関するバグ修正
- 2018/3/1 ver.2.6.0
    - `[gulp\-json\-to\-sass](https://www.npmjs.com/package/gulp-json-to-sass)`を使って、共通の`json`から`ejs`,`js`, `scss`でパラメータを使いまわせるようにした
- 2018/3/1 ver.2.5.8
    - パラメータ周りを整理
        - `json`で管理するパラメータを拡張
            - `src/data/var.json`を`src/data/variables.json`に名称変更
            - 各`ejs`ファイルで設定していた連想配列`param`を丸ごと`variables.json`に格納
                - 呼び出しにファイル名をを使用するので`gulp-data`を追加。この処理でファイル名をキーにして`variables.json`の`param`の中から探す
                    - 参考:
                        - [EJS：インクルードしたファイル内で相対パスを設定する方法 \| NxWorld](https://www.nxworld.net/tips/ejs-relative-path-setting.html)
                        - [gulp\-ejsで<%= filename %>が使えない問題の回避策としてgulp\-dataを使う \- Qiita](https://qiita.com/nibushibu/items/d1d9325a61520dc8c422)
                - ついでに`body`タグと`main`タグに出力するページ識別用クラスを決め打ちではなく、上記のファイル名を使った出力に変更
- 2018/3/1 ver.2.5.7
    - ファイル名・ディレクトリ名の整理
        - ディレクトリ階層を変更
            - `ejs`
                - ヘッダやフッタなどのパーツ: `common`→`partial`
                - パス階層の場合分けや年数表示などのパラメータ・計算関連(それ自体にhtml出力なし): `common`→`control`
            - `scss`
                - ヘッダやフッタなどのパーツ: `common`→`partial`
            - `json`
                - `ejs`用のパラメータである`var.json`を`src/ejs/common/var.json`から`src/data/var.json`へ変更
                - 新着情報データの`news.json`を`src/ejs/news/news.json`から`src/data/news.json`へ変更
        - 一部scss関連の名称を変更
            1. 各コンテンツページ用のscssの名称を`common.scss`から`contents.scss`へ変更
                - 共通パーツのディレクトリである`common`
                - 共通読み込みの`_common.scss`
                - 各コンテンツページ用の`common.scss`
                - と`common`という名前が3つあって分かりづらかったため
            2. 上記の通り、共通パーツのディレクトリの名前は`common`から`partial`へ変更
            3. 共通読み込みの`_common.scss`はそのまま。`common`という名前はscssの中で1つのみにした
- 2018/2/24 ver.2.5.6
    - コピーライトの年数を決め打ちではなく、計算で変化するように変更
- 2018/2/22 ver.2.5.5
    - indexのmainにクラス付与、各ejsのbodyにクラス付与
    - now loadingの背景色を変数に
- 2018/2/19 ver.2.5.4
    - mainの左右paddingを削除
- 2018/2/19 ver.2.5.3
    - トップページ・各ページのキービジュアル周りを整理
- 2018/2/13 ver.2.5.2
    - faviconを追加。`gulpfile.js`もfaviconを出力するように追記
    - `head`タグ内にテーマカラーを出力するように追記。色は`var.json`で指定
- 2018/2/10 ver.2.5.1
    - トップページか否かの判定でナビゲーションバーのリンクを切り替えるように変更
- 2018/2/10 ver.2.5.0
    - 新着情報を件数指定で複数ページに分けて出力する機能を追加
        - 機能:
            - 新着情報を件数指定で複数ページに分けて出力
            - 新着情報一覧の上下にページネーションを出力
        - 変更点
            - `gulpfile.js`の設定を変更。`news.ejs`のみ別タスクに分離
            - `news<ページ数>.html`が生成されるディレクトリが今までより`/dist/news/`と1階層深くなりました
                - これに伴い、他のページからのリンクもパスを変更
        - 設定箇所:
            - 上記変更に伴い、設定箇所が増えました。詳しくは[Settings](#settings)を参照
    - パラメータを渡すため、ejsの`include`をディレクティブから関数に変更
- 2018/2/1 ver.2.4.4
    - ネタ更新:真言で`npm`が走るようにショートカットを追加
- 2018/1/31 ver.2.4.3
    - スタイルガイドにjsファイルを読み込んでいなかったバグを修正
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