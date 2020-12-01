import $ from 'jquery';
import bowser from 'bowser';

//iOS対策
export default () => {
    const browser = bowser.getParser(window.navigator.userAgent);
    const $body = $('body');
    if (browser.getOSName() === 'iOS') {
        //iPhoneかiPadならば
        $body.addClass('iosBG');
    }
};
