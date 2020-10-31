const config = {
  BASE_API_URL: process.env.VUE_APP_BASE_API_URL,
  DEFAULT_API_LOCALE: "en-US",
  MAX_REQUESTS_NUMBER: 15
};

/**
 * We need both versions for different calls:
 * V4 for the auth of the user because account requests require a account_id that we can only have with V4
 * V3 for the rest (watchlists, movies...)
 */
config.BASE_API_URL_V3 = `${config.BASE_API_URL}/3`;
config.BASE_API_URL_V4 = `${config.BASE_API_URL}/4`;

module.exports = config;
