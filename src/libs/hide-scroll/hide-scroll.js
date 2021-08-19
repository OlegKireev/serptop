const hideScroll = {
  hide: () => {
    if (document.body.offsetHeight > window.innerHeight) {
      document.body.style.paddingRight = `${hideScroll.getScrollWidth()}px`;
      document.body.style.overflow = 'hidden';
    }
  },
  show: (e) => {
    if (e.propertyName === 'transform') {
      document.body.style.paddingRight = '';
      document.body.style.overflow = 'initial';
      e.target.removeEventListener('transitionend', hideScroll.show);
    }
  },
  getScrollWidth() {
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
  },
};

export default hideScroll;
