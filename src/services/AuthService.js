import { BASE_API_URL_V3, BASE_API_URL_V4 } from "@/config";
import request from "@/utils/request";

const headers = {
  Authorization: `Bearer ${process.env.VUE_APP_API_ACCESS_TOKEN}`
};

/**
 * Steps of the login process:
 * 1. get a request_token that will need to be validated by the user
 * 2. open the window allowing the user to approve the request_token
 * 3. once the user close the window, we can continue to fetch the info that will be useful to handle his watchlist:
 *  - accountId
 *  - accessToken
 *  - sessionId
 * 4. GetUserInfo is composed of two requests:
 *  - the first one retrieve the accountId and the accessToken
 *  - the second one will get the sessionId
 *    (⚠️ for this request we need to go back to the V3 of the API because for some reason, we can't get a session id with V4 🙄)
 */

const login = async () => {
  try {
    const result = await request({
      method: "POST",
      url: `${BASE_API_URL_V4}/auth/request_token`,
      headers,
      body: JSON.stringify({
        redirect_to: `${process.env.VUE_APP_BASE_URL}/watchlist`
      })
    });

    const win = window.open(
      `https://www.themoviedb.org/auth/access?request_token=${result.request_token}`
    );
    return await new Promise(resolve => {
      const timer = setInterval(async function() {
        if (win.closed) {
          resolve(await getUserInfo(result.request_token));
          clearInterval(timer);
        }
      }, 500);
    });
  } catch (error) {
    return null;
  }
};
const getUserInfo = async token => {
  try {
    /**
     * Unlike what is said in the API doc, for the following requests,
     * request_token and access_token should be sent in url query and not in the body 😑
     * As you can guess, it took me a while to figure this out...
     */
    const result = await request({
      method: "POST",
      url: `${BASE_API_URL_V4}/auth/access_token?request_token=${token}`,
      headers
    });

    const resultSession = await request({
      method: "POST",
      url: `${BASE_API_URL_V3}/authentication/session/convert/4?api_key=${process.env.VUE_APP_API_KEY}&access_token=${result.access_token}`,
      headers
    });

    return {
      accountId: result.account_id,
      accessToken: result.access_token,
      sessionId: resultSession.session_id
    };
  } catch (error) {
    return null;
  }
};
export default {
  login,
  getUserInfo
};
