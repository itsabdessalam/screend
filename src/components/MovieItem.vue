<template>
  <router-link
    :to="`/movies/${movie.id}`"
    :class="`slider__item ${this.type} movie`"
  >
    <Img
      v-if="type === 'poster'"
      :src="getImageSource(movie.poster_path, 'poster')"
      :alt="movie.title"
      class="movie__thumbnail"
    />
    <Img
      v-else
      :src="getImageSource(movie.backdrop_path, 'backdrop')"
      :alt="movie.title"
      class="movie__thumbnail"
    />
  </router-link>
</template>

<script>
import ImageMixin from "@/mixins/ImageMixin";

export default {
  name: "MovieItem",
  mixins: [ImageMixin],
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
