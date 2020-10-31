import { BASE_API_URL_V3 } from "@/config";
import request from "@/utils/request";

export default {
  async addMovieToWatchlist(sessionId, accountId, movieId) {
    try {
      const result = await request({
        method: "POST",
        url: `${BASE_API_URL_V3}/account/${accountId}/watchlist?api_key=${process.env.VUE_APP_API_KEY}&session_id=${sessionId}`,
        headers: {
          "content-type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          media_type: "movie",
          media_id: movieId,
          watchlist: true
        })
      });

      return result;
    } catch (error) {
      return null;
    }
  },
  async getMoviesWatchlist(sessionId, accountId) {
    try {
      const result = await request({
        url: `${BASE_API_URL_V3}/account/${accountId}/watchlist/movies?api_key=${process.env.VUE_APP_API_KEY}&session_id=${sessionId}`
      });
      return result.results || [];
    } catch (error) {
      return null;
    }
  }
};
