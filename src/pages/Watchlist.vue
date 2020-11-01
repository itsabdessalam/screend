<template>
  <div>
    <h1>My watchlist</h1>
    <div v-if="!isAuthenticated">
      <p>You need to login to access your watchlist.</p>
      <button @click="login">Login</button>
    </div>
    <div v-else>
      <button @click="logout">Log out</button>
      <div v-for="movie in watchlist" :key="movie.id">
        <img
          :src="`https://image.tmdb.org/t/p/original/${movie.poster_path}`"
          alt=""
          width="auto"
          height="300"
        />
        <p>{{ movie.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";
import WatchlistService from "@/services/WatchlistService";

import { mapGetters } from "vuex";
export default {
  name: "Watchlist",
  data() {
    return {
      watchlist: []
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "sessionId", "accountId"])
  },
  created() {
    if (this.isAuthenticated) {
      this.getUserWatchlist();

      // I'm leaving this as an example if you want to add movies to your watchlist to test the watchlist display
      WatchlistService.addMovieToWatchlist(
        this.sessionId,
        this.accountId,
        31011
      ).then(response => console.log(response));
    }
  },
  methods: {
    getUserWatchlist() {
      if (!this.isAuthenticated || !this.sessionId || !this.accountId) {
        return;
      }
      WatchlistService.getMoviesWatchlist(this.sessionId, this.accountId).then(
        response => {
          if (response && response.length) {
            this.watchlist = response;
          }
        }
      );
    },
    login() {
      AuthService.login().then(response => {
        if (response) {
          this.$store.dispatch("login", response);
          this.getUserWatchlist();
        }
      });
    },
    logout() {
      this.watchlist = [];
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style lang="scss" scoped></style>
