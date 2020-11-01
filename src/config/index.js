const config = {
  BASE_API_URL: process.env.VUE_APP_BASE_API_URL,
  BASE_IMAGE_URL: "https://image.tmdb.org/t/p",
  DEFAULT_API_LOCALE: "en-US",
  MAX_REQUESTS_NUMBER: 15,
  MIN_MOVIE_YEAR: 1888
};

/**
 * We need both versions for different calls:
 * V4 for the auth of the user because account requests require a account_id that we can only have with V4
 * V3 for the rest (watchlists, movies...)
 */
config.BASE_API_URL_V3 = `${config.BASE_API_URL}/3`;
config.BASE_API_URL_V4 = `${config.BASE_API_URL}/4`;

config.IMAGES_SIZES = {
  backdrop: "w342",
  poster: "w342",
  profile: "w185",
  default: "orignal"
};

module.exports = config;
