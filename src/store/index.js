import Vue from "vue";
import Vuex from "vuex";
import auth from "@/store/modules/auth";
import navigation from "@/store/modules/navigation";
import watchlist from "@/store/modules/watchlist";

// This will allow us to use som vuex features like mapGetters
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    navigation,
    watchlist
  }
});
