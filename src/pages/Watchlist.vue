<template>
  <div>
    <h2>My watchlist</h2>
    <div v-if="!isAuthenticated">
      <p>You need to login to access your watchlist.</p>
      <button @click="login">Login</button>
    </div>
    <div v-else>
      <button @click="logout">Log out</button>
      <div v-for="movie in watchlist" :key="movie.id">
        <button
          @click="removeMovieFromWatchlist(sessionId, accountId, movie.id)"
        >
          Remove from watchlist
        </button>
        <a href="" @click.prevent="goToMovieDetails(movie.id)">
          <Img
            :src="getImageSource(movie.poster_path, 'poster')"
            width="auto"
            height="300"
            :alt="movie.title"
          />
          <p>{{ movie.title }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";

import { mapGetters } from "vuex";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

export default {
  name: "Watchlist",
  mixins: [ImageMixin, MovieMixin],
  computed: {
    ...mapGetters(["isAuthenticated", "sessionId", "accountId", "watchlist"])
  },
  methods: {
    login() {
      AuthService.login().then(response => {
        if (response) {
          this.$store.dispatch("login", response);
          this.$store.dispatch("getWatchlist", {
            sessionId: this.sessionId,
            accountId: this.accountId
          });
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
