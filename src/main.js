import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Img } from "@/components";

import "@/assets/fonts/index.scss";
import "@/assets/sass/globals.scss";

import { truncate } from "@/filters/string";
import { year } from "@/filters/date";

Vue.config.productionTip = false;

Vue.component("Img", Img);
Vue.filter("truncate", truncate);
Vue.filter("year", year);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
