<template>
  <div>
    <h2>Movies</h2>
    <MovieFilters
      :genres="genres"
      @updateFilters="getMoviesList"
      @updateSearchedMovies="searchInMoviesList"
    />
    <div
      v-for="(movie, index) in movies"
      :key="index"
      style="display: inline-block; padding-left: 15px; width: 200px;"
    >
      <img
        :src="getPosterImageSource(movie)"
        alt=""
        width="200"
        height="auto"
      />
      <p>{{ movie.title }}</p>
      <p>{{ movie.release_date }}</p>
    </div>
  </div>
</template>

<script>
import MovieFilters from "@/components/elements/MovieFilters";

import MovieService from "@/services/MovieService";

import ScreendPortraitImg from "@/assets/images/screend-portrait.png";

export default {
  name: "Movies",
  components: {
    MovieFilters
  },
  data() {
    return {
      defaultMoviePoster: ScreendPortraitImg,
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
    getPosterImageSource(movie) {
      if (movie.poster_path) {
        return `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
      }
      // Set a default poster image if the movie does not have its own
      return this.defaultMoviePoster;
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
