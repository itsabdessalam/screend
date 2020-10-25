import {
  BASE_API_URL,
  DEFAULT_API_LOCALE,
  MAX_REQUESTS_NUMBER
} from "@/config";
import request from "@/utils/request";

export default {
  /**
   * Get list of movies matching a user input
   * @param {String} query - user input
   * @returns {Promise<Object>} { list: Array, page: Number }
   */
  async getMovieSearchList(query) {
    try {
      let page = 1;
      let list = [];
      let hasMoreResults = true;
      while (page <= MAX_REQUESTS_NUMBER && hasMoreResults) {
        const result = await request({
          url: `${BASE_API_URL}/search/movie?api_key=${process.env.VUE_APP_API_KEY}&query=${query}&language=${DEFAULT_API_LOCALE}&page=${page}`
        });

        if (!result.results) {
          hasMoreResults = false;
          break;
        }
        list = list.concat(result.results);
        page++;
      }
      return { list, totalPage: page - 1 };
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the details of a movie
   *
   * ⚠️ Because videos and first page of the reviews come from appended requests (look at append_to_response),
   * the data is accessible through videos.results and reviews.results
   * @param {String/Number} movieId - both stringify number or actual number can be passed
   * @returns {Promise<Object>}
   */
  async getMovieDetails(movieId) {
    try {
      return await request({
        url: `${BASE_API_URL}/movie/${movieId}?api_key=${process.env.VUE_APP_API_KEY}&append_to_response=videos,reviews`
      });
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the reviews of a movie
   *
   * @COMMENTS Can be useful to display all the reviews of a movie
   * Currently I'm doing a loop to get them all at once but we could also add a pagination in the reviews section and
   * fetch the paginated list on each page? I'll update it when we will have decide on what we want to do
   *
   * @param {String/Number} movieId - both stringify number or actual number can be passed
   * @returns {Promise<Object>} { list: Array, page: Number }
   */
  async getMovieReviews(movieId) {
    try {
      let page = 1;
      let list = [];
      let hasMoreResults = true;
      while (page <= MAX_REQUESTS_NUMBER && hasMoreResults) {
        const result = await request({
          url: `${BASE_API_URL}/movie/${movieId}/reviews?api_key=${process.env.VUE_APP_API_KEY}&page=${page}`
        });

        if (!result.results) {
          hasMoreResults = false;
          break;
        }
        list = list.concat(result.results);
        page++;
      }
      return { list, totalPage: page - 1 };
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the credits (cast and crew) of a movie
   * @param {String/Number} movieId - both stringify number or actual number can be passed
   * @returns {Promise<Object>} { id, cast, crew }
   */
  async getMovieCredits(movieId) {
    try {
      return await request({
        url: `${BASE_API_URL}/movie/${movieId}/credits?api_key=${process.env.VUE_APP_API_KEY}`
      });
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the list of the trending movies
   * @param {Number} page
   * @returns {Promise<Object>} { page, results, total_pages, total_results }
   */
  async getTrendingMovies(page = 1) {
    try {
      return await request({
        url: `${BASE_API_URL}/trending/movie/week?api_key=${process.env.VUE_APP_API_KEY}&page=${page}`
      });
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the list of the upcoming movies
   * @param {Number} page
   * @param {String} region - two-letter code like US, FR, DE, IT...
   * @returns {Promise<Object>} { page, results, total_pages, total_results }
   */
  async getUpcomingMovies(page = 1, region = "US") {
    try {
      return await request({
        url: `${BASE_API_URL}/movie/upcoming?api_key=${process.env.VUE_APP_API_KEY}&page=${page}&region=${region}`
      });
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the list of movies to discover
   *
   * @COMMENTS We could use sort_by = 'release_date.desc' to get the new movies instead of popular ones
   *
   * @param {Number} page
   * @param {String} sort_by - look at the API available list (https://developers.themoviedb.org/3/discover/movie-discover)
   * @param {String} region - two-letter code like US, FR, DE, IT...
   * @returns {Promise<Object>} { page, results, total_pages, total_results }
   */
  async getMoviesDiscoveryList(
    page = 1,
    sort_by = "popularity.desc",
    region = "US"
  ) {
    try {
      // Format the current date like: 2020-10-24
      const dateLimit = new Date().toISOString().slice(0, 10);
      return await request({
        url: `${BASE_API_URL}/discover/movie?api_key=${process.env.VUE_APP_API_KEY}&page=${page}&sort_by=${sort_by}&region=${region}&release_date.lte=${dateLimit}`
      });
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the list of available countries in the API
   *
   * @COMMENTS Could be useful for our filters
   *
   * @returns {Promise<Array>}
   */
  async getAvailableCountriesList() {
    try {
      return await request({
        url: `${BASE_API_URL}/configuration/countries?api_key=${process.env.VUE_APP_API_KEY}`
      });
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the list of movie genres
   *
   * @COMMENTS Could also be useful for our filters but also to display the main genres in a category or something like that
   *
   * @returns {Promise<Object>} { genres }
   */
  async getGenresList() {
    try {
      return await request({
        url: `${BASE_API_URL}/genre/movie/list?api_key=${process.env.VUE_APP_API_KEY}`
      });
    } catch (error) {
      return null;
    }
  }
};
