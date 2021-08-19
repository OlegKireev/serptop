const menu = document.querySelector('.menu__list');
const burger = document.querySelector('.burger');
const backdrop = document.querySelector('.backdrop');
import hideScroll from '%libs%/hide-scroll/hide-scroll';

if (menu) {
  const openMenu = () => {
    hideScroll.hide();
    menu.classList.add('active');
    backdrop.classList.add('active');
    window.addEventListener('keyup', escKeyupHandler);
    window.addEventListener('click', clickOutMenuHandler);
  };
  const closeMenu = () => {
    menu.addEventListener('transitionend', hideScroll.show);
    menu.classList.remove('active');
    backdrop.classList.remove('active');
    window.removeEventListener('keyup', escKeyupHandler);
    window.removeEventListener('click', clickOutMenuHandler);
  };
  const escKeyupHandler = (e) => {
    if (e.code === 'Escape') {
      closeMenu();
    }
  };
  const clickOutMenuHandler = (e) => {
    const target = e.target;
    const itsMenu = target === menu || menu.contains(target);
    const itsBtn = target === burger || burger.contains(target);
    const menuIsActive = menu.classList.contains('active');

    if (!itsMenu && !itsBtn && menuIsActive) {
      closeMenu();
    }
  };

  burger.addEventListener('click', openMenu);
}
