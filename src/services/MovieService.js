import {
  BASE_API_URL_V3,
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
          url: `${BASE_API_URL_V3}/search/movie?api_key=${process.env.VUE_APP_API_KEY}&query=${query}&language=${DEFAULT_API_LOCALE}&page=${page}`
        });

        if (!result.results.length) {
          hasMoreResults = false;
          break;
        }
        list = list.concat(result.results);
        page++;
      }
      return list;
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
        url: `${BASE_API_URL_V3}/movie/${movieId}?api_key=${process.env.VUE_APP_API_KEY}&append_to_response=videos,reviews`
      });
    } catch (error) {
      return null;
    }
  },
  /**
   * Get the paginated reviews of a movie
   *
   * @param {String/Number} movieId - both stringify number or actual number can be passed
   * @returns {Promise<Array>}
   */
  async getMovieReviews(movieId, page = 1) {
    try {
      const result = await request({
        url: `${BASE_API_URL_V3}/movie/${movieId}/reviews?api_key=${process.env.VUE_APP_API_KEY}&page=${page}`
      });
      return result.results;
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
        url: `${BASE_API_URL_V3}/movie/${movieId}/credits?api_key=${process.env.VUE_APP_API_KEY}`
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
        url: `${BASE_API_URL_V3}/trending/movie/week?api_key=${process.env.VUE_APP_API_KEY}&page=${page}`
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
        url: `${BASE_API_URL_V3}/movie/upcoming?api_key=${process.env.VUE_APP_API_KEY}&page=${page}&region=${region}`
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
   * @param {String} sort_by - look at the API available list (https://developers.themoviedb.org/3/discover/movie-discover)
   * @param {String} region - two-letter code like US, FR, DE, IT...
   * @param {Number} selectedYear - release year
   * @param {Array<Object>} selectedGenres - list of genres { id, name }
   * @param {Boolean} includeUpcoming - include upcoming movies or not
   * @returns {Promise<Object>} { page, results, total_pages, total_results }
   */
  async getMoviesDiscoveryList({
    sort_by = "popularity.desc",
    region = "US",
    selectedYear = null,
    selectedGenres = [],
    includeUpcoming = false
  }) {
    try {
      let page = 1;
      let query = `?api_key=${process.env.VUE_APP_API_KEY}&sort_by=${sort_by}&region=${region}`;

      /**
       * If no specific year mentionned and if upcoming movies should not be included,
       * get the movies already released only
       */
      if (!selectedYear && !includeUpcoming) {
        // Format the current date like: 2020-10-24
        const dateLimit = new Date().toISOString().slice(0, 10);
        query += `&release_date.lte=${dateLimit}`;
      }

      if (selectedYear) {
        query += `&primary_release_year=${selectedYear}`;
      }

      if (selectedGenres && selectedGenres.length) {
        // We should only pass the genres ids in the query such as: '54,254,89'
        query += `&with_genres=${selectedGenres
          .map(item => item.id)
          .join(",")}`;
      }

      let list = [];
      let hasMoreResults = true;
      // Get the maximum of results
      while (page <= MAX_REQUESTS_NUMBER && hasMoreResults) {
        const result = await request({
          url: `${BASE_API_URL_V3}/discover/movie${query}&page=${page}`
        });

        if (!result.results.length) {
          hasMoreResults = false;
          break;
        }
        list = list.concat(result.results);
        page++;
      }

      return list;
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
        url: `${BASE_API_URL_V3}/configuration/countries?api_key=${process.env.VUE_APP_API_KEY}`
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
   * @returns {Promise<Array>}
   */
  async getGenresList() {
    try {
      const result = await request({
        url: `${BASE_API_URL_V3}/genre/movie/list?api_key=${process.env.VUE_APP_API_KEY}`
      });
      return result.genres || [];
    } catch (error) {
      return null;
    }
  }
};
