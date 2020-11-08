<template>
  <div>
    <!-- <button @click="goBack">Back</button> -->
    <div v-if="!isLoading && !isResponseEmpty" class="movie">
      <Modal v-if="video && showModal" @close="closeModal">
        <template #body>
          <Player :id="video.id" />
        </template>
      </Modal>
      <!-- <div class="movie__backdrop">
        <Img
          :src="getImageSource(movie.backdrop_path, 'backdrop_full')"
          width="auto"
          height="300"
          :alt="movie.title"
        />
      </div> -->
      <div>
        <div class="movie__overview">
          <div
            :class="
              `movie__poster  movie__overview__section movie__overview__section--left ${
                movie.vote_average ? 'movie__poster--rated' : ''
              } `
            "
          >
            <Img
              :src="getImageSource(movie.poster_path, 'poster')"
              :alt="movie.title"
            />
            <span class="movie__rate" v-if="movie.vote_average">
              {{ movie.vote_average * 10 }}% Match
            </span>
          </div>
          <div
            class="movie__meta  movie__overview__section movie__overview__section--right"
          >
            <h2 class="movie__title">{{ movie.title }}</h2>
            <p class="movie__summary">{{ movie.overview }}</p>

            <ul class="movie__details">
              <li v-if="movie.release_date" class="movie__details__item">
                <span class="label">Release date</span>
                <span class="value">{{
                  movie.release_date | toLocaleDate
                }}</span>
              </li>
              <li v-if="movie.status" class="movie__details__item">
                <span class="label">Status</span>
                <span class="value">{{ movie.status }}</span>
              </li>
              <li v-if="movie.runtime" class="movie__details__item">
                <span class="label">Duration</span>
                <span class="value">{{
                  convertMovieRuntime(movie.runtime)
                }}</span>
              </li>
              <li v-if="movie.genres.length" class="movie__details__item">
                <span class="label">Genres</span>
                <span class="value">{{
                  movie.genres.map(genre => genre.name).join(", ")
                }}</span>
              </li>
              <li
                v-if="movie.production_companies.length"
                class="movie__details__item"
              >
                <span class="label">Production</span>
                <span class="value">{{
                  movie.production_companies
                    .map(production => production.name)
                    .join(", ")
                }}</span>
              </li>
              <li v-if="movie.original_language" class="movie__details__item">
                <span class="label">Language</span>
                <span class="value">{{
                  movie.original_language | toLanguageName
                }}</span>
              </li>
            </ul>

            <div class="movie__actions">
              <div v-if="isAuthenticated">
                <button
                  v-if="isInWatchlist"
                  @click="
                    removeMovieFromWatchlist(sessionId, accountId, movie.id)
                  "
                  class="movie__action movie__action--remove"
                >
                  Remove from watchlist
                </button>
                <button
                  v-else
                  @click="addToWatchlist(sessionId, accountId, movie)"
                  class="movie__action movie__action--add"
                >
                  Add to watchlist
                </button>
              </div>
              <div v-if="video">
                <button
                  id="show-modal"
                  @click="openModal"
                  class="movie__action movie__action--trailer"
                >
                  Watch trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="movie__cast">
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
              class="movie__cast__profile"
            />
            <span class="movie__cast__name">
              {{ member.name }}
            </span>
            <span class="movie__cast__character">
              {{ member.character }}
            </span>
          </div>
        </div>
        <span v-else>No cast found...</span>
      </div>
    </div>
    <span v-else-if="!isLoading && isResponseEmpty">No movie found...</span>
    <Loader v-else />
  </div>
</template>

<script>
import MovieService from "@/services/MovieService";

import { mapGetters } from "vuex";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

import MoviePlayerMixin from "@/mixins/MoviePlayerMixin";

import { Modal, Player, Loader } from "@/components";

import { GO_BACK_ROUTES } from "@/config";

export default {
  name: "movie",
  mixins: [ImageMixin, MovieMixin, MoviePlayerMixin],
  components: {
    Modal,
    Player,
    Loader
  },
  data() {
    return {
      cast: [],
      currentReviewPage: 1,
      isLoading: true,
      isResponseEmpty: false,
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
        if (!movie || !credits) {
          this.isResponseEmpty = true;
          return;
        }

        this.movie = movie;
        this.reviews = this.movie.reviews.results || [];
        this.total_reviews = this.movie.reviews.total_results || 0;
        this.cast = credits.cast || {};
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
.movie {
  .movie__cast {
    margin-top: 60px;

    .movie__cast__list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      grid-gap: 6px;
      margin-top: 32px;
      position: relative;

      .movie__cast__item {
        margin-bottom: 12px;

        .movie__cast__name {
          font-size: 14px;
          height: 18px;
        }

        .movie__cast__character {
          font-size: 12px;
          height: 16px;
          color: #696969;
        }

        .movie__cast__name,
        .movie__cast__character {
          font-weight: 500;

          overflow: hidden;
          display: block;
          position: relative;
        }
      }
    }
  }

  .movie__overview {
    display: flex;
    width: 100%;
    height: 100%;

    .movie__overview__section {
      display: block;
      float: left;

      &--left {
        width: 25%;
      }

      &--right {
        display: flex;
        width: 75%;
        padding-left: 32px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }

    .movie__title {
      margin-top: 0;
    }

    .movie__summary {
      margin-bottom: 24px;
    }

    .movie__poster {
      position: relative;
      max-height: 480px;
      max-width: 320px;

      &--rated:after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        background-image: linear-gradient(
          0,
          #000 0,
          transparent 50%,
          transparent
        );
        z-index: 10;
      }
    }

    .movie__rate {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      position: absolute;
      bottom: 12px;
      left: 12px;
      z-index: 100;
    }
  }

  .movie__details {
    display: flex;
    flex-wrap: wrap;

    .movie__details__item {
      width: 100%;
      display: flex;

      &:not(:last-child) {
        margin-bottom: 4px;
      }

      span {
        flex: 1;

        &.label {
          max-width: 160px;
          color: #696969;
        }
      }
    }
  }

  .movie__actions {
    display: flex;
    margin-top: 32px;

    .movie__action {
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      background-color: transparent;

      &--add,
      &--remove {
        background-color: #525253;
        color: #ffffff;
        margin-right: 8px;
      }

      &--trailer {
        background-color: $primary;
      }
    }
  }
}
</style>
