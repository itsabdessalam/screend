export default {
  methods: {
    addToWatchlist(sessionId, accountId, movie) {
      this.$store.dispatch("addToWatchlist", {
        sessionId,
        accountId,
        movie
      });
    },
    goToMovieDetails(movieId) {
      this.$router.push(`/movies/${movieId}`);
    },
    isMovieInWatchlist(watchlist, movieId) {
      return watchlist.some(movie => movie.id === movieId);
    },
    removeMovieFromWatchlist(sessionId, accountId, movieId) {
      this.$store.dispatch("removeFromWatchlist", {
        sessionId,
        accountId,
        movieId
      });
    }
  }
};
