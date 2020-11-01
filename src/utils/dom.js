/**
 * Returns width and height of main window
 *
 * @returns {Array}
 */
export const getWindowSize = () => [
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth,
  window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
];

/**
 * Returns width and height of a given element
 *
 * @param {HTMLElement} el
 * @returns {Array}
 */
export const getSize = el => [el.clientWidth, el.clientHeight];

/**
 * Returns current scroll position of a given element
 *
 * @param {*} [el=window]
 * @returns {Array}
 */
export const getScrollPosition = (el = window) => [
  el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
];
