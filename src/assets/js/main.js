//Material ripple effect for mdc-button
import {MDCRipple} from '@material/ripple';

const selector = '.mdc-button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
  return new MDCRipple(el);
});

//Material Drawer instantiation
import {MDCDrawer} from "@material/drawer";
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
//import {MDCTopAppBar} from "@material/top-app-bar";
//const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');
const drawerToggle = document.querySelector('.drawer-toggle');

drawerToggle.addEventListener('click', (event) => {
  drawer.open = !drawer.open;
  drawerToggle.classList.add('drawer-toggle--opened');
});



listEl.addEventListener('click', (event) => {
  drawer.open = false;
  drawerToggle.classList.remove('drawer-toggle--opened');
});

document.body.addEventListener('MDCDrawer:closed', () => {
  mainContentEl.querySelector('input, button').focus();
  drawerToggle.classList.remove('drawer-toggle--opened');
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
