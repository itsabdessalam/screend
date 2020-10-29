<template>
  <div v-if="movies.length">
    <section class="hero">
      <Billboard :movie="movies[0]" />
    </section>
    <section class="my-list"></section>
    <section class="trending-now"></section>
    <section class="most-watched"></section>
    <section class="upcoming"></section>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import Billboard from "@/components/elements/Billboard";

// temporary data mock
import moviesData from "@/mock/movies.json";

export default {
  name: "Home",
  components: {
    Billboard
  },
  data() {
    return {
      movies: moviesData.results || []
    };
  }
};
</script>
