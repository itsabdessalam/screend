import {
  BASE_API_URL_V3,
  DEFAULT_API_LOCALE,
  MAX_REQUESTS_NUMBER,
  DEFAULT_SORT_BY_FILTER
} from "@/config";
import request from "@/utils/request";

export default {
  /**
   * Get list of movies matching a user input
   * @param {String} query - user input
   * @param {Number} nbRequests - how many requests should we make, it determines how many movies we return (20 movies per request)
   * @param {Number} page - the number of the first page we query, can be different than 1 if previous requests have been made
   * @returns {Promise<Object>} { list: Array, page: Number, hasMoreResults: Boolean }
   */
  async getMovieSearchList(query, nbRequests = MAX_REQUESTS_NUMBER, page = 1) {
    try {
      let list = [];
      let hasMoreResults = true;
      let pagesFetched = 1;
      while (pagesFetched <= nbRequests && hasMoreResults) {
        const result = await request({
          url: `${BASE_API_URL_V3}/search/movie?api_key=${process.env.VUE_APP_API_KEY}&query=${query}&language=${DEFAULT_API_LOCALE}&page=${page}`
        });

        list = list.concat(result.results);
        hasMoreResults = result.total_pages > page;
        if (!hasMoreResults) {
          break;
        }
        page++;
        pagesFetched++;
      }
      return { list, page, hasMoreResults };
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
   * Get the list of movies to discover
   *
   * @param {String} sortBy - look at the API available list (https://developers.themoviedb.org/3/discover/movie-discover)
   * @param {String} region - two-letter code like US, FR, DE, IT...
   * @param {Number} selectedYear - release year
   * @param {Array<Object>} selectedGenres - list of genres { id, name }
   * @param {Boolean} includeUpcoming - include upcoming movies or not
   * @param {Boolean} upcomingOnly - can be activated through the home page, section "Upcoming" only
   * @param {Number} nbRequests - how many requests should we make, it determines how many movies we return (20 movies per request)
   * @param {Number} page - the number of the first page we query, can be different than 1 if previous requests have been made
   * @returns {Promise<Object>} { list: Array, page: Number, hasMoreResults: Boolean }
   */
  async getMoviesDiscoveryList({
    sortBy = DEFAULT_SORT_BY_FILTER,
    region = "US",
    selectedYear = null,
    selectedGenres = [],
    includeUpcoming = false,
    upcomingOnly = false,
    nbRequests = MAX_REQUESTS_NUMBER,
    page = 1
  }) {
    try {
      let query = `?api_key=${process.env.VUE_APP_API_KEY}&sort_by=${sortBy.value}&region=${region}&language=en-US`;

      /**
       * Priority to upcomingOnly filter, it takes over the other dates related filters
       * Then, if no specific year mentionned and if upcoming movies should not be included,
       * get the movies already released only
       *
       * The dates are formatted like: 2020-10-24
       */
      if (upcomingOnly) {
        const dateLimit = new Date();
        // Add one day to the current date to skip movies released today
        dateLimit.setDate(dateLimit.getDate() + 1);
        query += `&primary_release_date.gte=${dateLimit
          .toISOString()
          .slice(0, 10)}`;
      } else if (!selectedYear && !includeUpcoming) {
        query += `&primary_release_date.lte=${new Date()
          .toISOString()
          .slice(0, 10)}`;
      } else if (selectedYear) {
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
      let pagesFetched = 1;
      // Get the maximum of results
      while (pagesFetched <= nbRequests && hasMoreResults) {
        const result = await request({
          url: `${BASE_API_URL_V3}/discover/movie${query}&page=${page}`
        });

        list = list.concat(result.results);
        hasMoreResults = result.total_pages > page;
        if (!hasMoreResults) {
          break;
        }

        page++;
        pagesFetched++;
      }

      return { list, page, hasMoreResults };
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
