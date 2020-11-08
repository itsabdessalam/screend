import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Img } from "@/components";

import "@/assets/fonts/index.scss";
import "@/assets/sass/globals.scss";

import { truncate, convertStringToKebabCase } from "@/filters/string";
import { getYear, getLocaleDate } from "@/filters/date";
import { getLanguageName } from "@/filters/language";

Vue.config.productionTip = false;

Vue.component("Img", Img);
Vue.filter("truncate", truncate);
Vue.filter("toKebabCase", convertStringToKebabCase);
Vue.filter("year", getYear);
Vue.filter("toLanguageName", getLanguageName);
Vue.filter("toLocaleDate", getLocaleDate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
