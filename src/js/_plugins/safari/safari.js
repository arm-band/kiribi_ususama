import $ from 'jquery';
import bowser from 'bowser';

//mobile Saffari対策
export default () => {
    const browser = bowser.getParser(window.navigator.userAgent);
    const $body = $('body');
    if (browser.getBrowserName() === 'Safari' && browser.getOSName() === 'iOS') {
        //iPhoneかiPadならば
        $body.addClass('mobileSafari');
    }
};
