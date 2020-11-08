<template>
  <div>
    <h2>Movie</h2>
    <button @click="goBack">Back</button>
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

      <h3>{{ movie.title }}</h3>
      <!-- Backdrop -->
      <Img
        :src="getImageSource(movie.backdrop_path, 'backdrop')"
        width="auto"
        height="300"
        :alt="movie.title"
      />
      <!-- Poster -->
      <Img
        :src="getImageSource(movie.poster_path, 'poster')"
        width="auto"
        height="300"
        :alt="movie.title"
      />
      <p>Release date: {{ movie.release_date }}</p>
      <p>Duration: {{ convertMovieRuntime(movie.runtime) }}</p>
      <p>
        Genres:
        {{ movie.genres && movie.genres.map(genre => genre.name).join(", ") }}
      </p>
      <p>{{ movie.overview }}</p>
      <p>
        User score:
        {{
          movie.vote_average
            ? `${movie.vote_average * 10}% (${movie.vote_count} votes)`
            : "None"
        }}
      </p>
    </div>
    <div>
      <h4>Cast</h4>
      <div v-if="cast.length">
        <div
          v-for="member in cast"
          :key="member.id"
          style="display: inline-block; padding-bottom:30px;"
        >
          <Img
            :src="getImageSource(member.profile_path, 'profile')"
            width="auto"
            height="300"
            :alt="movie.title"
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
    <div>
      <h4>Reviews</h4>
      <div v-if="total_reviews">
        <p>{{ total_reviews }} reviews</p>
        <div v-for="review in reviews" :key="review.id">
          <p>By {{ review.author }}:</p>
          <p>{{ review.content }}</p>
        </div>
        <!-- We can also go for a classic pagination depending on what UI you imagine for this page -->
        <button v-if="total_reviews > reviews.length" @click="loadMoreReviews">
          Load more reviews...
        </button>
      </div>
      <p v-else>No review yet...</p>
    </div>
  </div>
</template>

<script>
import MovieService from "@/services/MovieService";

import { mapGetters } from "vuex";

import ImageMixin from "@/mixins/ImageMixin";
import MovieMixin from "@/mixins/MovieMixin";

import { GO_BACK_ROUTES } from "@/config";

export default {
  name: "movie",
  mixins: [ImageMixin, MovieMixin],
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
    MovieService.getMovieDetails(this.$route.params.id)
      .then(response => {
        this.movie = response;
        if (this.movie.reviews) {
          this.reviews = this.movie.reviews.results || [];
          this.total_reviews = this.movie.reviews.total_results || 0;
        }
      })
      .catch(error => console.error(error))
      .finally(() => (this.isLoading = false));

    MovieService.getMovieCredits(this.$route.params.id)
      .then(response => (this.cast = response.cast))
      .catch(error => console.error(error));
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

<style lang="scss" scoped></style>
