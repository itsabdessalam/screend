<template>
  <div>
    <h2>Movies</h2>
    <MovieFilters
      :genres="genres"
      @updateFilters="getMoviesList"
      @updateSearchedMovies="searchInMoviesList"
    />
    <div
      v-for="movie in movies"
      :key="movie.id"
      style="display: inline-block; padding-left: 15px; width: 200px;"
    >
      <a href="" @click.prevent="goToMovieDetails(movie.id)">
        <img
          :src="getPosterImageSource(movie.poster_path)"
          alt=""
          width="200"
          height="auto"
        />
        <p>{{ movie.title }}</p>
        <p>{{ movie.release_date }}</p>
      </a>
    </div>
  </div>
</template>

<script>
import MovieFilters from "@/components/elements/MovieFilters";

import MovieService from "@/services/MovieService";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

export default {
  name: "Movies",
  components: {
    MovieFilters
  },
  mixins: [ImageMixin, MovieMixin],
  data() {
    return {
      isLoading: true,
      genres: [],
      movies: []
    };
  },
  created() {
    this.getMoviesList({});
    MovieService.getGenresList().then(response => (this.genres = response));
  },
  methods: {
    getMoviesList(filters) {
      this.isLoading = true;
      // Request to get movies filtered by genres, year, etc.
      MovieService.getMoviesDiscoveryList(filters)
        .then(response => (this.movies = response))
        .catch(error => {
          console.error(error);
        })
        .finally(() => (this.isLoading = false));
    },
    searchInMoviesList(text) {
      this.isLoading = true;
      // Request to get movies filtered by a user input
      MovieService.getMovieSearchList(text)
        .then(response => (this.movies = response))
        .catch(error => {
          console.error(error);
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>

<style lang="scss" scoped></style>
