<template>
  <div>
    <h2>Movies</h2>
    <MovieFilters
      :genres="genres"
      @updateFilters="getMoviesList"
      @updateSearchedMovies="searchInMoviesList"
    />
    <div class="movies" :class="isLoading ? 'loading' : 'loaded'">
      <div v-if="!isLoading && movies.length" class="movie__list">
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
      <div v-else-if="!isLoading && !movies.length">No movie available</div>
      <Loader v-else />
    </div>
  </div>
</template>

<script>
import { MovieFilters, Loader } from "@/components";

import MovieService from "@/services/MovieService";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

export default {
  name: "Movies",
  components: {
    MovieFilters,
    Loader
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

<style lang="scss" scoped>
.movies {
  height: calc(100vh - 300px);

  &.loading {
    display: flex;
  }

  .movie__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 8px;
    margin-top: 32px;
    position: relative;

    .movie__item {
      overflow: hidden;

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
}
</style>
