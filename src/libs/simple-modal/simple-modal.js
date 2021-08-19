import {ResizeObserver} from '@juggle/resize-observer';
export default (() => {
  const CLASS_LIST = {
    MODAL: 'modal',
    MODAL_ACTIVE: 'modal--active',
    MODAL_CURRENT: 'modal--current',
    MODAL_HAS_SCROLL: 'modal--has-scroll',
    MODAL_DIALOG_BODY: 'modal__body',
    TRIGGER_OPEN: 'js-modal-open',
    TRIGGER_CLOSE: 'js-modal-close',
  };
  const ESC_KEYCODE = 27;
  let resizeObserver = null;
  const modals = [];

  const escPressHandler = (e) => {
    if (e.code === 'Escape' || e.keyCode === ESC_KEYCODE) {
      hideModal(e);
      showScroll(e);
    }
  };

  const showModal = (e) => {
    const target = e.target.closest(`.${CLASS_LIST.TRIGGER_OPEN}`);
    const modalId = target.dataset.modal;
    const modal = document.getElementById(modalId);
    modals.push(modal);
    if (modals.length > 1) {
      hideModal();
    }

    hideScroll();

    bindResizeObserver(modal);
    window.addEventListener('keydown', escPressHandler);
    modal.classList.add(CLASS_LIST.MODAL_ACTIVE);
    modal.classList.add(CLASS_LIST.MODAL_CURRENT);
  };

  const hideModal = (e) => {
    const modal = document.querySelector(`.${CLASS_LIST.MODAL_CURRENT}`);
    modal.classList.remove(CLASS_LIST.MODAL_ACTIVE);
    modal.classList.remove(CLASS_LIST.MODAL_CURRENT);
    if (modals.length >= 1) {
      modals.pop();
    }

    unbindResizeObserver(modal);
    if (modals.length === 0) {
      modal.addEventListener('transitionend', showScroll);
    }
    window.removeEventListener('keydown', escPressHandler);
  };

  const hideScroll = () => {
    if (document.body.offsetHeight > window.innerHeight) {
      document.body.style.paddingRight = `${getScrollWidth()}px`;
      document.body.style.overflow = 'hidden';
    }
  };

  const showScroll = (e) => {
    if (e.propertyName === 'transform') {
      document.body.style.paddingRight = '';
      document.body.style.overflow = 'initial';
      e.target.closest(`.${CLASS_LIST.MODAL}`).removeEventListener('transitionend', showScroll);
    }
  };

  const getScrollWidth = () => {
    const item = document.createElement('DIV');
    item.style.position = 'absolute';
    item.style.top = '-9999px';
    item.style.width = '50px';
    item.style.height = '50px';
    item.style.overflow = 'scroll';
    item.style.visibility = 'hidden';

    document.body.appendChild(item);
    const scrollWidth = item.offsetWidth - item.clientWidth;
    document.body.removeChild(item);
    return scrollWidth;
  };

  const bindResizeObserver = (modal) => {
    const content = modal.querySelector(`.${CLASS_LIST.MODAL_DIALOG_BODY}`);
    const toggleShadows = () => {
      modal.classList.toggle(CLASS_LIST.MODAL_HAS_SCROLL, content.scrollHeight > content.clientHeight);
    };

    resizeObserver = new ResizeObserver(toggleShadows);
    resizeObserver.observe(content);
  };

  const unbindResizeObserver = (modal) => {
    const content = modal.querySelector(`.${CLASS_LIST.MODAL_DIALOG_BODY}`);
    resizeObserver.unobserve(content);
    resizeObserver = null;
  };

  const init = () => {
    document.addEventListener('click', (e) => {
      if (e.target.closest(`.${CLASS_LIST.TRIGGER_OPEN}`)) {
        e.preventDefault();
        showModal(e);
      }
      if (e.target.closest(`.${CLASS_LIST.TRIGGER_CLOSE}`) || e.target.classList.contains(CLASS_LIST.MODAL_ACTIVE)) {
        e.preventDefault();
        hideModal(e);
      }
    });
    // return this;
  };

  init();
})();
