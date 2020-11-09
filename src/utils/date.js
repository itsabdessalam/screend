/**
 * Returns full year of a given date
 *
 * @returns {string}
 */
export const getYear = date => {
  return new Date(date).getFullYear();
};

/**
 * Returns locale date of a given date
 *
 * @param {string} date
 * @param {string} [locale="en-US"]
 * @return {string}
 */
export const getLocaleDate = (date, locale = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
};
