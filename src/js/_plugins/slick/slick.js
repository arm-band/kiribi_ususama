import $ from 'jquery';
import 'slick-carousel/slick/slick.js';

//slick
export default () => {
    const $slider = $('.slider');
    $slider.slick({
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: '<div class="slide_arrow slide_arrowLeft"><i class="fa fa-fw fa-3x fa-chevron-left" aria-hidden="true"></i></div>',
        nextArrow: '<div class="slide_arrow slide_arrowRight"><i class="fa fa-fw fa-3x fa-chevron-right" aria-hidden="true"></i></div>',
    });
    $slider.on({
        mouseenter: function () {
            $(this).addClass('arrowShow');
        },
        mouseleave: function () {
            $(this).removeClass('arrowShow');
        },
    });
};
