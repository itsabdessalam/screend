<template>
  <section :class="section.title | toKebabCase">
    <div class="section__header">
      <h2 class="section__title">{{ section.title }}</h2>
      <div class="section__actions">
        <a href @click.prevent="goToMovies()">View all</a>
      </div>
    </div>
    <div class="section__content">
      <Slider>
        <MovieItem
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
        ></MovieItem>
      </Slider>
    </div>
  </section>
</template>

<script>
import { Slider, MovieItem } from "@/components";

import { DEFAULT_FILTERS, SORT_BY_FILTERS } from "@/config";

import MovieService from "@/services/MovieService";

export default {
  name: "MovieSection",
  components: {
    Slider,
    MovieItem
  },
  props: {
    section: { type: Object, required: true }
  },
  data() {
    return {
      filters: JSON.parse(JSON.stringify(DEFAULT_FILTERS)),
      movies: []
    };
  },
  created() {
    this.formatSectionFilters(this.section.filters);
    this.getMoviesList();
  },
  methods: {
    formatSectionFilters(sectionFilters) {
      for (const filter of sectionFilters) {
        if (filter.name === "sortBy") {
          this.filters[filter.name] =
            Object.values(SORT_BY_FILTERS)
              .flat()
              .find(item => item.value === filter.value) ||
            this.filters[filter.name];
          continue;
        }
        this.filters[filter.name] = filter.value;
      }
    },
    getMoviesList() {
      MovieService.getMoviesDiscoveryList({
        ...this.filters,
        nbRequests: 1
      })
        .then(response => {
          this.movies = response.list.slice(0, this.section.limit);
          this.$emit("loadSection", this.section.title);
        })
        .catch(error => {
          console.error(error);
        });
    },
    goToMovies() {
      this.$store.commit("UPDATE_FILTERS", this.filters);
      this.$router.push("/movies");
    }
  }
};
</script>

<style lang="scss" scoped></style>
