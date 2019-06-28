//facebookをリサイズする度に幅を調整
const facebookResize = function() {
    let $fbWrapper = $('#fbWrapper')
    let fbBeforeWidth = ''
    let fbWidth = $fbWrapper.width()
    //setTimeOutで負荷軽減
    let timer = false
    $(window).on('load resize', function() {
        if (timer !== false) {
            clearTimeout(timer)
        }
        timer = setTimeout(function() {
            fbWidth = $fbWrapper.width()
            if(fbWidth !== fbBeforeWidth) {
                $fbWrapper.html(fbCodeGen(fbWidth))
                window.FB.XFBML.parse()
                fbBeforeWidth = fbWidth
            }
        }, 300)
    })
}

//facebookのコードを生成
const fbCodeGen = function(w) {
    const hrefUrl = 'https://www.facebook.com/facebook'
    const name = 'Facebook'

    return `<div class="fb-page" data-href="${hrefUrl}" data-tabs="timeline" data-width="${w}" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false"><blockquote cite="${hrefUrl}" class="fb-xfbml-parse-ignore"><a href="${hrefUrl}">${name}</a></blockquote></div>`
}