<template>
  <div class="movie__list">
    <div v-for="(movie, index) in movies" :key="index" class="movie__item">
      <Button
        v-if="context === 'watchlist'"
        @click="removeMovieFromWatchlist(sessionId, accountId, movie.id)"
        class="button--secondary"
        style="display:none;"
      >
        Remove from watchlist
      </Button>
      <router-link :to="`/movies/${movie.id}`" class="movie__link">
        <div class="movie__thumbnail">
          <Img :src="movie.poster_path" :alt="movie.title" type="poster" />
        </div>
        <div class="movie__meta">
          <p class="movie__title">{{ movie.title }}</p>
          <p class="movie__release">{{ movie.release_date }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MovieMixin from "@/mixins/MovieMixin";
import { Button } from "@/components";

export default {
  name: "MovieList",
  mixins: [MovieMixin],
  components: {
    Button
  },
  computed: {
    ...mapGetters(["isAuthenticated", "sessionId", "accountId", "watchlist"])
  },
  props: {
    context: {
      type: String,
      default: ""
    },
    movies: { type: Array, required: true }
  }
};
</script>

<style lang="scss" scoped>
.movie__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  column-gap: 6px;
  row-gap: 12px;
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
        margin-bottom: 0;

        &:after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 30px;
          height: 23px;
          background: linear-gradient(to right, rgba(0, 0, 0, 0), #000000 80%);
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
</style>
