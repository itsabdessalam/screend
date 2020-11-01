const state = {
  sessionId: localStorage.getItem("session_id") || "",
  accountId: localStorage.getItem("account_id") || "",
  accessToken: localStorage.getItem("access_token") || ""
};

const getters = {
  isAuthenticated: state => !!state.sessionId,
  sessionId: state => state.sessionId,
  accountId: state => state.accountId,
  accessToken: state => state.accessToken
};

const actions = {
  login: ({ commit }, { accountId, accessToken, sessionId }) => {
    // @COMMENT If you think it would be more clever to save everything in one single item in the localstorage, let me know
    localStorage.setItem("session_id", sessionId);
    localStorage.setItem("account_id", accountId);
    localStorage.setItem("access_token", accessToken);
    commit("AUTH_LOGIN", { accountId, accessToken, sessionId });
  },
  logout: ({ commit }) => {
    localStorage.removeItem("session_id");
    localStorage.removeItem("account_id");
    localStorage.removeItem("access_token");
    commit("AUTH_LOGOUT");
  }
};

const mutations = {
  AUTH_LOGIN: (state, { accountId, accessToken, sessionId }) => {
    state.sessionId = sessionId;
    state.accountId = accountId;
    state.accessToken = accessToken;
  },
  AUTH_LOGOUT: state => {
    state.sessionId = "";
    state.accountId = "";
    state.accessToken = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
