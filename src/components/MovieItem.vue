<template>
  <router-link
    :to="`/movies/${movie.id}`"
    :class="`slider__item ${this.type} movie`"
  >
    <div v-if="type === 'poster'">
      <Img
        :src="getImageSource(movie.poster_path, 'poster')"
        :alt="movie.title"
      />
    </div>
    <div v-else>
      <Img
        :src="getImageSource(movie.backdrop_path, 'backdrop')"
        :alt="movie.title"
      />
    </div>
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

<style lang="scss" scoped></style>
