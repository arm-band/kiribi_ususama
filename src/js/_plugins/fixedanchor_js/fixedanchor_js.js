import $ from 'jquery';

export default () => {
    return parseInt($('body').attr('data-offset'));
};
