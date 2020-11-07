/**
 * Returns a deeply cloned object without reference.
 * Copied from Vuex
 *
 * @type {Object}
 */
export const deepClone = obj => {
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  } else if (obj && typeof obj === "object") {
    const cloned = {};
    const keys = Object.keys(obj);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      cloned[key] = deepClone(obj[key]);
    }
    return cloned;
  } else {
    return obj;
  }
};
