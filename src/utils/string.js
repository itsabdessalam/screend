/**
 * Truncates a string up to a specified length
 *
 * @param {string} value - Value to truncate
 * @param {number} limit - Max length of returned string
 *
 * @returns {string} Truncated string to the desired length
 */
export const truncate = (value, limit) =>
  value.length > limit
    ? value.slice(0, limit > 3 ? limit - 3 : limit) + "..."
    : value;

/**
 * Convert a string into the Kebab case Format
 * e.g:
 * "My wonderful text" => "my-wonderful-text"
 * @param {String} str
 * @returns {String} String converted to Kebab case
 */
export const convertStringToKebabCase = str => {
  return str.toLowerCase().replace(" ", "-");
};
