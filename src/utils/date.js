/**
 * Returns full yean of a given date
 *
 * @returns {string}
 */
export const getYear = date => {
  return new Date(date).getFullYear();
};

/**
 *
 *
 * @param {*} date
 * @param {string} [locale="en-US"]
 * @return {*}
 */
export const getLocaleDate = (date, locale = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
};
