<<<<<<< Updated upstream
=======
//Material ripple effect for mdc-button
import {MDCRipple} from '@material/ripple';

const selector = '.mdc-button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
  return new MDCRipple(el);
});

// Slick carousel
import "../../../node_modules/jquery/dist/jquery";
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import "../../../node_modules/slick-carousel/slick/slick";

$(document).ready(function(){
  $('.slick-carousel').slick({
   infinite: true,
   dots: true,
   arrows: false,
   infinite: true,
   adaptiveHeight: false
  });
});
>>>>>>> Stashed changes
