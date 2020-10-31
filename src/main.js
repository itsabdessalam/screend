import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Img } from "@/components/elements";

import "@/assets/fonts/index.scss";
import "@/assets/sass/globals.scss";

import { truncate } from "@/filters/string";

Vue.config.productionTip = false;

Vue.component("Img", Img);
Vue.filter("truncate", truncate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
