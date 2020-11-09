<template>
  <router-link
    :to="`/movies/${movie.id}`"
    :class="`slider__item ${this.type} movie`"
  >
    <Img
      v-if="type === 'poster'"
      :src="movie.poster_path"
      :alt="movie.title"
      class="movie__thumbnail"
      type="poster"
    />
    <Img
      v-else
      :src="movie.backdrop_path"
      :alt="movie.title"
      class="movie__thumbnail"
      type="backdrop"
    />
  </router-link>
</template>

<script>
export default {
  name: "MovieItem",
  props: {
    movie: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: "poster"
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.movie {
  overflow: hidden;

  .movie__thumbnail {
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    will-change: transform;
    transform: scale(1);

    img {
      overflow: hidden;
    }
  }

  &:hover {
    .movie__thumbnail {
      transform: scale(1.02);
    }
  }
}
</style>
