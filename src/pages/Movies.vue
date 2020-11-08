<template>
  <div>
    <h2>Movies</h2>
    <MovieFilters
      :genres="genres"
      @updateFilters="getMoviesList"
      @updateSearchedMovies="searchInMoviesList"
    />
    <div
      class="movies"
      v-if="!isLoading && movies.length"
      :class="isLoading ? 'loading' : 'loaded'"
    >
      <div class="movie__list">
        <div v-for="(movie, index) in movies" :key="index" class="movie__item">
          <router-link :to="`/movies/${movie.id}`" class="movie__link">
            <div class="movie__thumbnail">
              <Img
                :src="getImageSource(movie.poster_path, 'poster')"
                :alt="movie.title"
              />
            </div>
            <div class="movie__meta">
              <p class="movie__title">{{ movie.title }}</p>
              <p class="movie__release">{{ movie.release_date }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div v-else-if="!isLoading && !movies.length">No movie found...</div>
    <Loader v-else />
  </div>
</template>

<script>
import { MovieFilters, Loader } from "@/components";

import MovieService from "@/services/MovieService";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

import { mapGetters } from "vuex";

export default {
  name: "Movies",
  components: {
    MovieFilters,
    Loader
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

<style lang="scss" scoped>
.movies {
  &.loading {
    display: flex;
  }

  .movie__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 6px;
    margin-top: 32px;
    position: relative;

    .movie__item {
      .movie__thumbnail {
        overflow: hidden;
        transition: transform 0.3s ease-in-out;
        will-change: transform;
        transform: scale(1);
      }

      .movie__meta {
        color: #ffffff;

        .movie__title {
          font-size: 14px;
          font-weight: 500;
          height: 23px;
          overflow: hidden;
          display: block;
          position: relative;

          &:after {
            content: "";
            position: absolute;
            bottom: 0;
            right: 0;
            width: 30px;
            height: 23px;
            background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0),
              #000000 80%
            );
          }
        }

        .movie__release {
          display: none;
        }
      }

      &:hover {
        .movie__thumbnail {
          transform: scale(1.02);
        }
      }
    }
  }

  .movies__see-more {
    position: fixed;
    bottom: 12px;
    right: 12px;
  }
}
</style>
