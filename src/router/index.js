import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/pages/Home.vue"),
    meta: {
      title: "Homepage - Screend"
    }
  },
  {
    path: "/movies",
    name: "movies",
    component: () =>
      import(/* webpackChunkName: "movies" */ "@/pages/Movies.vue"),
    meta: {
      title: "Movies - Screend"
    }
  },
  {
    path: "/movies/:id",
    name: "movie-details",
    component: () =>
      import(/* webpackChunkName: "movieDetails" */ "@/pages/Movie.vue"),
    meta: {
      title: "Movie Details - Screend"
    }
  },
  // redirect if no route matches to dashboard
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Screend";
  next();
});

export default router;
