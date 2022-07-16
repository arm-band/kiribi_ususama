/**
 * ページトップへ戻る
 *
 * constructor:
 *
 * @param {string} observeSelectorName - 監視対象要素のセレクタ名 (デフォルト: .l-main)
 * @param {string} targetSelectorName  - クラス付与要素のセレクタ名 (デフォルト: .c-returnPageTop)
 */
class returnPageTop {
    /**
     * constructor
     *
     * @param {string} observeSelectorName - 監視対象要素のセレクタ名 (デフォルト: .l-main)
     * @param {string} targetSelectorName  - クラス付与要素のセレクタ名 (デフォルト: .c-returnPageTop)
     */
    constructor(observeSelectorName = '.c-intersectionReturnPageTop', targetSelectorName = '.c-returnPageTop') {
        // 監視対象要素
        this.observeElms = document.querySelectorAll(observeSelectorName);
        // DOM to Array
        this.observeElmsArray = Array.prototype.slice.call(this.observeElms, 0);
        // クラス付与要素
        this.targetElms = document.querySelectorAll(targetSelectorName);
        // クラス付与要素の Array
        this.targetElmsArray = Array.prototype.slice.call(this.targetElms, 0);
        // options
        this.options = {
            root: null,
            rootMargin: '0px 0px -12%',
            threshold: 0
        };
        // ブラウザの高さ
        this.clientHeight = document.documentElement.clientHeight;
        // ページトップへ戻る
        this.rptObserver = this.rptShow(this.clientHeight);
        window.addEventListener('resize', () => {
            // resize でブラウザの表示領域の高さが変動したら
            this.clientHeight = document.documentElement.clientHeight;
            // 一旦監視を止める
            this.rptObserver.disconnect();
            // 再度監視
            this.rptObserver = this.rptShow(this.clientHeight);
        });
    };
    /**
     * IntersectionObserver で指定するコールバック関数。ページトップへ戻るのクリック対象要素を、 targetSelectorName で指定した要素と交差するかを判定して、その結果で表示・非表示を切り替えるための .activeクラス の着脱を行う
     *
     * @param {Array} - elms
     */
    addClass = (elms) => {
        const elmsArray = Array.prototype.slice.call(elms, 0);
        for (const elm of elmsArray) {
            // ブラウザ表示領域に対する対象要素の位置
            const elmRectCoor = elm.target.getBoundingClientRect();
            if ( 0 > elmRectCoor.bottom ) {
                // ブラウザ表示領域に対する対象要素の上端の位置 が ブラウザの表示領域 より上
                for (const targetElm of this.targetElmsArray) {
                    targetElm.classList.add('active');
                }
            }
            else {
                for (const targetElm of this.targetElmsArray) {
                    targetElm.classList.remove('active');
                }
            }
        }
    };
    /**
     * observeSelectorName で指定した複数の要素(ページトップへ戻るボタン)を IntersectionObserverクラス による監視対象とする
     *
     * @returns {Object} observer - IntersectionObserverクラス
     */
    rptShow = () => {
        // instance
        const observer = new IntersectionObserver(this.addClass, this.options);
        // observe
        for (const selector of this.observeElmsArray) {
            observer.observe(selector);
        }
        return observer;
    };
};

export default returnPageTop;
