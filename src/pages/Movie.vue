<template>
  <div>
    <button @click="goBack" class="goback">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        ></path></svg
      >Go back
    </button>
    <div v-if="!isLoading && !isResponseEmpty" class="movie">
      <Modal v-if="video && showModal" @close="closeModal">
        <template #body>
          <Player :id="video.id" />
        </template>
      </Modal>
      <div v-if="movie.backdrop_path" class="movie__backdrop">
        <Img
          :src="movie.backdrop_path"
          :alt="movie.title"
          class="movie__thumbnail"
          type="backdrop_full"
        />
      </div>
      <div class="movie__overview">
        <div
          :class="
            `movie__poster  movie__overview__section movie__overview__section--left ${
              movie.vote_average ? 'movie__poster--rated' : ''
            } `
          "
        >
          <Img :src="movie.poster_path" :alt="movie.title" type="poster" />
          <span class="movie__rate" v-if="movie.vote_average">
            <IMDbIcon />
            <span>{{ movie.vote_average }}</span>
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
              <span class="value">{{ movie.release_date | toLocaleDate }}</span>
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
            <li v-if="movie.vote_count" class="movie__details__item">
              <span class="label">Reviews</span>
              <span class="value">{{ movie.vote_count }}</span>
            </li>
          </ul>
          <div class="movie__actions">
            <div v-if="isAuthenticated">
              <Button
                v-if="isInWatchlist"
                @click="
                  removeMovieFromWatchlist(sessionId, accountId, movie.id)
                "
                class="button--secondary movie__action movie__action--remove"
              >
                Remove from watchlist
              </Button>
              <Button
                v-else
                @click="addToWatchlist(sessionId, accountId, movie)"
                class="button--secondary movie__action movie__action--add"
              >
                Add to watchlist
              </Button>
            </div>
            <div v-if="video">
              <Button
                id="show-modal"
                @click="openModal"
                class="button--primary movie__action movie__action--trailer"
              >
                Watch trailer
              </Button>
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
              :src="member.profile_path"
              :alt="member.name"
              class="movie__cast__profile"
              type="profile"
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
import { mapGetters } from "vuex";
import { GO_BACK_ROUTES } from "@/config";
import MovieService from "@/services/MovieService";

import MovieMixin from "@/mixins/MovieMixin";
import MoviePlayerMixin from "@/mixins/MoviePlayerMixin";
import { Modal, Player, Button, Loader } from "@/components";
import { IMDb as IMDbIcon } from "@/icons";

export default {
  name: "movie",
  mixins: [MovieMixin, MoviePlayerMixin],
  components: {
    Modal,
    Player,
    Loader,
    Button,
    IMDbIcon
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
      return hours + "h " + minutes;
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
    },
    loadMoreReviews() {
      this.currentReviewPage++;
      MovieService.getMovieReviews(
        this.$route.params.id,
        this.currentReviewPage
      )
        .then(response => {
          this.reviews = this.reviews.concat(response);
        })
        .catch(error => console.error(error));
    }
  }
};
</script>

<style lang="scss" scoped>
.goback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  position: relative;
  z-index: 1070;
  background: transparent;
  border: none;
  padding: 0;
  margin-bottom: 24px;

  > svg {
    width: 14px;
    margin-right: 8px;
  }
}
.movie {
  .movie__backdrop {
    position: absolute;
    overflow: hidden;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: 90vh;
    transform: scale(1.5);
    filter: blur(13px) opacity(0.2);
  }

  .movie__cast {
    margin-top: 60px;
    position: relative;
    z-index: 1070;

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
    position: relative;
    z-index: 1070;

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
      height: 480px;
      width: 320px;

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
      border-radius: 4px;
      border: 1px solid $primary;
      color: $primary;
      font-size: 12px;
      font-weight: 500;
      width: 66px;
      padding: 0 6px 0 0px;
      line-height: 22px;
      z-index: 100;

      position: absolute;
      bottom: 12px;
      right: 12px;
      z-index: 100;

      > svg {
        width: 38px;
        height: auto;
      }
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
      &--add,
      &--remove {
        background-color: #525253;
        color: #ffffff;
        margin-right: 8px;
      }
    }
  }
}
</style>
