export default {
  methods: {
    goToMovieDetails(movieId) {
      this.$router.push(`/movies/${movieId}`);
    }
  }
};
