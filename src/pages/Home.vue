<template>
  <div v-if="movies.length">
    <section class="hero">
      <Billboard :movie="movies[0]" />
    </section>
    <section class="my-list">
      <Slider></Slider>
    </section>
    <section class="trending-now">
      <Slider></Slider>
    </section>
    <section class="most-watched">
      <Slider></Slider>
    </section>
    <section class="upcoming">
      <Slider></Slider>
    </section>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { Billboard, Slider } from "@/components/elements";

// temporary data mock
import moviesData from "@/mock/movies.json";

export default {
  name: "Home",
  components: {
    Billboard,
    Slider
  },
  data() {
    return {
      movies: moviesData.results || []
    };
  }
};
</script>
