<template>
  <div>
    <h2>My watchlist</h2>
    <div v-if="!isAuthenticated">
      <p>You need to login to access your watchlist.</p>
      <Button @click="login" class="button--secondary">Login</Button>
    </div>
    <div v-else>
      <Button @click="logout" class="button--secondary">Log out</Button>
      <MovieList :movies="watchlist" context="watchlist" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AuthService from "@/services/AuthService";
import { Button, MovieList } from "@/components";

export default {
  name: "Watchlist",
  computed: {
    ...mapGetters(["isAuthenticated", "sessionId", "accountId", "watchlist"])
  },
  components: {
    Button,
    MovieList
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
