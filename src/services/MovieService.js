import {
  BASE_API_URL,
  DEFAULT_API_LOCALE,
  MAX_REQUESTS_NUMBER
} from "@/config";
import request from "@/utils/request";

export default {
  async getMovieSearchList(query) {
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
  }
};
