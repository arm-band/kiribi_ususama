import bowser from 'bowser';

//iOS対策
export default () => {
    const browser = bowser.getParser(window.navigator.userAgent);
    const $body = document.querySelector('body');
    if (browser.getOSName() === 'iOS') {
        //iPhoneかiPadならば
        $body.classList.add('iosBG');
    }
};
