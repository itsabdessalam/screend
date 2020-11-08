<template>
  <div>
    <h2>Movies</h2>
    <MovieFilters
      :genres="genres"
      @updateFilters="getMoviesList"
      @updateSearchedMovies="searchInMoviesList"
    />
    <MovieList v-if="!isLoading && movies.length" :movies="movies" />
    <div v-else-if="!isLoading && !movies.length">No movie found...</div>
    <Loader v-else />
  </div>
</template>

<script>
import { MovieFilters, MovieList, Loader } from "@/components";

import MovieService from "@/services/MovieService";
import MovieMixin from "@/mixins/MovieMixin";

import { mapGetters } from "vuex";

export default {
  name: "Movies",
  components: {
    MovieFilters,
    MovieList,
    Loader
  },
  mixins: [MovieMixin],
  data() {
    return {
      currentPage: 1,
      hasMoreResults: false,
      isLoading: true,
      isSearchingByText: false,
      genres: [],
      movies: []
    };
  },
  computed: {
    ...mapGetters(["filters", "searchedText"])
  },
  created() {
    MovieService.getGenresList().then(response => (this.genres = response));

    window.addEventListener("scroll", this.onScroll);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("scroll", this.onScroll);
    });
  },
  methods: {
    fetchMoreMovies() {
      /**
       * I don't really know what would the correct number of movies to add
       * For now, I set nbRequests to 2 (= 40 movies) but I'll let you test
       * and see if you think a single request is enough
       * or if we can add even more movies with 'see more'
       */
      if (this.isSearchingByText) {
        this.searchInMoviesList(this.searchedText, false, 2, this.currentPage);
        return;
      }

      this.getMoviesList(
        {
          ...this.filters,
          page: this.currentPage,
          nbRequests: 2
        },
        false
      );
    },
    getMoviesList(filters, resetMovies = true) {
      this.isLoading = !!resetMovies;
      this.isSearchingByText = false;
      // Request to get movies filtered by genres, year, etc.
      MovieService.getMoviesDiscoveryList(filters)
        .then(response => {
          this.setMoviesData(response, resetMovies);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => (this.isLoading = false));
    },
    searchInMoviesList(text, resetMovies = true, nbRequests, page) {
      this.isLoading = true;
      this.isSearchingByText = true;
      // Request to get movies filtered by a user input
      MovieService.getMovieSearchList(text, nbRequests, page)
        .then(response => {
          this.setMoviesData(response, resetMovies);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => (this.isLoading = false));
    },
    setMoviesData(response, resetMovies) {
      if (resetMovies) {
        this.movies = response.list;
      } else {
        this.movies = this.movies.concat(response.list);
      }
      this.currentPage = response.page;
      this.hasMoreResults = response.hasMoreResults;
    },
    onScroll() {
      if (
        this.hasMoreResults &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        this.fetchMoreMovies();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
