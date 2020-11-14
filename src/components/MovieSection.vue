<template>
  <section :class="section.title | toKebabCase">
    <div class="section__header">
      <h2 class="section__title">{{ section.title }}</h2>
      <div class="section__actions">
        <a href @click.prevent="goToMovies()"
          >View all<svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path></svg
        ></a>
      </div>
    </div>
    <div class="section__content">
      <Slider :class="section.title | toKebabCase">
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

<style lang="scss" scoped>
.section__actions {
  a {
    display: flex;
    color: #ffffff;

    > svg {
      width: 14px;
      margin-left: 8px;
    }
  }
}
</style>
