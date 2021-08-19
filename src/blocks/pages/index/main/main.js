import Swiper from 'swiper/bundle';
window.Swiper = Swiper;

new Swiper('.hero__slider', {
  direction: 'horizontal',
  loop: true,
  allowTouchMove: false,
  autoplay: {
    delay: 10000,
  },
  navigation: {
    nextEl: '.next',
    prevEl: '.prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
  },
});

document.addEventListener('DOMContentLoaded', () => {
  const setSliderHeight = (offsetHeight) => {
    const slider = document.querySelector('#js-hero-slider');
    slider.style.setProperty('height', `calc(100vh - ${offsetHeight}px)`);
  };

  const headerEl = document.querySelector('.header-top');
  const headerTop = document.querySelector('.header');
  let headerHeight = headerEl.offsetHeight + headerTop.offsetHeight;

  window.addEventListener('resize', () => {
    headerHeight = headerEl.offsetHeight + headerTop.offsetHeight;
    setSliderHeight(headerHeight);
  });
  setSliderHeight(headerHeight);
});
