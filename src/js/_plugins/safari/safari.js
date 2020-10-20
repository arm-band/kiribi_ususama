//mobile Saffari対策
const mobileSafariRequiem = () => {
    const browser = bowser.getParser(window.navigator.userAgent);
    const $body = $('body');
    if (browser.getBrowserName() === 'Safari' && browser.getOSName() === 'iOS') {
        //iPhoneかiPadならば
        $body.addClass('mobileSafari');
    }
};
