<template>
  <div>
    <h2>Movie</h2>
    <button @click="goBack">Back</button>
    <div v-if="!isLoading" class="movie">
      <!-- <div class="movie__backdrop">
        <Img
          :src="getImageSource(movie.backdrop_path, 'backdrop_full')"
          width="auto"
          height="300"
          :alt="movie.title"
        />
      </div> -->
      <div>
        <div v-if="isAuthenticated">
          <button
            v-if="isInWatchlist"
            @click="removeMovieFromWatchlist(sessionId, accountId, movie.id)"
          >
            Remove from watchlist
          </button>
          <button v-else @click="addToWatchlist(sessionId, accountId, movie)">
            Add to watchlist
          </button>
        </div>

        <div class="movie__overview">
          <div
            class="movie__poster  movie__overview__section movie__overview__section--left"
          >
            <Img
              :src="getImageSource(movie.poster_path, 'poster')"
              :alt="movie.title"
            />
          </div>
          <div
            class="movie__meta  movie__overview__section movie__overview__section--right"
          >
            <h3 class="movie__title">{{ movie.title }}</h3>
            <p class="movie__summary">{{ movie.overview }}</p>
            <!-- <p v-if="movie.vote_average">
                {{ movie.vote_average * 10 }}% Match
              </p> -->
            <ul class="movie__details">
              <li class="movie__details__item">
                <span class="label">Release date</span>
                <span class="value">{{
                  movie.release_date | toLocaleDate
                }}</span>
              </li>
              <li class="movie__details__item">
                <span class="label">Status</span>
                <span class="value">{{ movie.status }}</span>
              </li>
              <li class="movie__details__item">
                <span class="label">Duration</span>
                <span class="value">{{
                  convertMovieRuntime(movie.runtime)
                }}</span>
              </li>
              <li class="movie__details__item" v-if="movie.genres.length">
                <span class="label">Genres</span>
                <span class="value">{{
                  movie.genres.map(genre => genre.name).join(", ")
                }}</span>
              </li>
              <li
                class="movie__details__item"
                v-if="movie.production_companies.length"
              >
                <span class="label">Production</span>
                <span class="value">{{
                  movie.production_companies
                    .map(production => production.name)
                    .join(", ")
                }}</span>
              </li>
              <li class="movie__details__item" v-if="movie.original_language">
                <span class="label">Language</span>
                <span class="value">{{
                  movie.original_language | toLanguageName
                }}</span>
              </li>
              <!-- <li class="movie__details__item">
                <span class="label">Vote</span>
                <span class="value">{{ movie.vote_average }}</span>
              </li> -->
            </ul>
          </div>
        </div>
      </div>
      <div class="movie__cast" v-if="cast && cast.length">
        <h4>Cast</h4>
        <div v-if="cast.length" class="movie__cast__list">
          <div
            v-for="member in cast"
            :key="member.id"
            class="movie__cast__item"
          >
            <Img
              :src="getImageSource(member.profile_path, 'profile')"
              :alt="member.name"
            />
            <p>
              {{ member.name }}
            </p>
            <p>
              <i>{{ member.character }}</i>
            </p>
          </div>
        </div>
      </div>
      <div style="display:none;">
        <h4>Reviews</h4>
        <div v-if="total_reviews">
          <p>{{ total_reviews }} reviews</p>
          <div v-for="review in reviews" :key="review.id">
            <p>By {{ review.author }}:</p>
            <p>{{ review.content }}</p>
          </div>
          <!-- We can also go for a classic pagination depending on what UI you imagine for this page -->
          <button
            v-if="total_reviews > reviews.length"
            @click="loadMoreReviews"
          >
            Load more reviews...
          </button>
        </div>
        <p v-else>No review yet...</p>
      </div>
    </div>
    <Loader v-else />
  </div>
</template>

<script>
import MovieService from "@/services/MovieService";

import { mapGetters } from "vuex";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

import { Loader } from "@/components";
import { GO_BACK_ROUTES } from "@/config";

export default {
  name: "movie",
  mixins: [ImageMixin, MovieMixin],
  components: {
    Loader
  },
  data() {
    return {
      cast: [],
      currentReviewPage: 1,
      isLoading: true,
      movie: {},
      prevRoute: null,
      reviews: [],
      total_reviews: 0
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "sessionId", "accountId", "watchlist"]),
    isInWatchlist() {
      return this.isMovieInWatchlist(this.watchlist, this.movie.id);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  },
  created() {
    if (!this.$route.params.id) {
      this.goBack();
    }

    Promise.all([
      MovieService.getMovieDetails(this.$route.params.id),
      MovieService.getMovieCredits(this.$route.params.id)
    ])
      .then(([movie, credits]) => {
        this.movie = movie;
        this.reviews = this.movie.reviews.results || [];
        this.total_reviews = this.movie.reviews.total_results || 0;
        this.cast = credits.cast;
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => (this.isLoading = false));
  },
  methods: {
    convertMovieRuntime(runtime) {
      var hours = Math.floor(runtime / 60);
      var minutes = runtime % 60;
      return hours + "h" + minutes;
    },
    goBack() {
      const authorizedRoute = Object.values(GO_BACK_ROUTES).find(
        route => route.name === this.prevRoute.name
      );
      if (authorizedRoute) {
        this.$router.push(authorizedRoute.path);
        return;
      }
      this.$router.push("/");
    }
    // loadMoreReviews() {
    //   this.currentReviewPage++;
    //   MovieService.getMovieReviews(
    //     this.$route.params.id,
    //     this.currentReviewPage
    //   )
    //     .then(response => {
    //       this.reviews = this.reviews.concat(response);
    //     })
    //     .catch(error => console.error(error));
    // }
  }
};
</script>

<style lang="scss" scoped>
.movie__cast {
  clear: both;
  .movie__cast__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    grid-gap: 6px;
    margin-top: 32px;
    position: relative;
  }
}

.movie__overview {
  display: inline-block;
  width: 100%;
  height: 100%;

  .movie__overview__section {
    display: block;
    float: left;

    &--left {
      width: 25%;
    }

    &--right {
      width: 75%;
      padding-left: 32px;
    }
  }

  .movie__title {
    margin-top: 0;
  }

  .movie__summary {
    margin-bottom: 24px;
  }

  .movie__poster {
    height: 480px;
    max-width: 320px;
  }
}

.movie__details {
  display: flex;
  flex-wrap: wrap;

  .movie__details__item {
    width: 100%;
    display: flex;

    &:not(:last-child) {
      margin-bottom: 2px;
    }

    span {
      flex: 1;

      &.label {
        max-width: 160px;
      }
    }
  }
}
</style>
