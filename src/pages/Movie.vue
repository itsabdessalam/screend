<template>
  <div>
    <h2>Movie</h2>
    <button @click="goBack">Back</button>
    <div>
      <h3>{{ movie.title }}</h3>
      <!-- Backdrop -->
      <img
        :src="getPosterImageSource(movie.backdrop_path)"
        alt=""
        width="auto"
        height="300"
        style="display: block;"
      />
      <!-- Poster -->
      <img
        :src="getPosterImageSource(movie.poster_path)"
        alt=""
        width="auto"
        height="300"
        style="display: block;"
      />
      <p>Release date: {{ movie.release_date }}</p>
      <p>Duration: {{ convertMovieRuntime(movie.runtime) }}</p>
      <p>Genres: {{ movie.genres.map(genre => genre.name).join(", ") }}</p>
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
      <h4>Reviews</h4>
      <div
        v-if="
          movie.reviews && movie.reviews.results && movie.reviews.results.length
        "
      >
        <div v-for="review in movie.reviews.results" :key="review.id">
          <p>By {{ review.author }}:</p>
          <p>{{ review.content }}</p>
        </div>
      </div>
      <p v-else>No review yet...</p>
    </div>
  </div>
</template>

<script>
import MovieService from "@/services/MovieService";

import ImageMixin from "@/mixins/ImageMixin";

export default {
  name: "movie",
  mixins: [ImageMixin],
  data() {
    return {
      isLoading: true,
      movie: {}
    };
  },
  created() {
    if (!this.$route.params.id) {
      this.goBack();
    }
    MovieService.getMovieDetails(this.$route.params.id)
      .then(response => {
        this.movie = response;
      })
      .catch(error => console.error(error))
      .finally(() => (this.isLoading = false));
  },
  methods: {
    convertMovieRuntime(runtime) {
      var hours = Math.floor(runtime / 60);
      var minutes = runtime % 60;
      return hours + "h" + minutes;
    },
    goBack() {
      this.$router.push("/movies");
    }
  }
};
</script>

<style lang="scss" scoped></style>
