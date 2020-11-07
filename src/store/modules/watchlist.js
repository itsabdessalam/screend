import WatchlistService from "@/services/WatchlistService";

const state = {
  isWatchlistInitialized: false,
  watchlist: []
};
const getters = {
  isWatchlistInitialized: state => state.isWatchlistInitialized,
  watchlist: state => state.watchlist
};
const actions = {
  addToWatchlist({ commit }, { sessionId, accountId, movie }) {
    WatchlistService.addMovieToWatchlist(sessionId, accountId, movie.id).then(
      response => {
        if (response) {
          commit("ADD_TO_WATCHLIST", movie);
        }
      }
    );
  },
  getWatchlist({ commit }, { sessionId, accountId }) {
    WatchlistService.getMoviesWatchlist(sessionId, accountId).then(response => {
      if (response && response.length) {
        commit("UPDATE_WATCHLIST", response);
      }
    });
  },
  removeFromWatchlist({ commit }, { sessionId, accountId, movieId }) {
    console.log(sessionId, accountId, movieId);
    WatchlistService.removeMovieFromWatchlist(
      sessionId,
      accountId,
      movieId
    ).then(response => {
      if (response) {
        commit("REMOVE_FROM_WATCHLIST", movieId);
      }
    });
  }
};
const mutations = {
  ADD_TO_WATCHLIST: (state, movie) => {
    state.watchlist.push(movie);
  },
  REMOVE_FROM_WATCHLIST: (state, movieId) => {
    const idx = state.watchlist.findIndex(movie => movie.id === movieId);
    console.log(idx);
    if (idx > -1) {
      state.watchlist.splice(idx, 1);
    }
  },
  UPDATE_WATCHLIST: (state, watchlist) => {
    state.watchlist = watchlist;
    state.isWatchlistInitialized = true;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
