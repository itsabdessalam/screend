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
        <Img
          :src="getImageSource(movie.poster_path, 'poster')"
          width="auto"
          height="200"
          :alt="movie.title"
        />
        <p>{{ movie.title }}</p>
        <p>{{ movie.release_date }}</p>
      </a>
    </div>
    <button v-if="hasMoreResults" @click="fetchMoreMovies">See more...</button>
  </div>
</template>

<script>
import { MovieFilters } from "@/components";

import MovieService from "@/services/MovieService";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

import { mapGetters } from "vuex";

export default {
  name: "Movies",
  components: {
    MovieFilters
  },
  mixins: [ImageMixin, MovieMixin],
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
      this.isLoading = true;
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
