import config from "@/config";

const state = {
  filters: config.DEFAULT_FILTERS,
  searchedText: ""
};

const getters = {
  filters: state => state.filters,
  searchedText: state => state.searchedText
};

// These actions are not really useful now because we're directly committing the changes
// But let's keep them in case we want to implement more logic
const actions = {};

const mutations = {
  RESET_FILTERS: state => {
    state.filters = config.DEFAULT_FILTERS;
    state.searchedText = "";
  },
  UPDATE_FILTERS: (state, filters) => {
    state.filters = filters;
  },
  UPDATE_SEARCHED_TEXT: (state, searchedText) => {
    state.searchedText = searchedText;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
