<template>
  <div>
    <input
      type="checkbox"
      id="checkbox"
      v-model="filters.includeUpcoming"
      :disabled="!!searchedText.length"
    />
    <label for="checkbox">include incoming movies</label>

    <div style="display: inline-block; padding-left: 15px;">
      <label class="typo__label">Release year</label>
      <multiselect
        v-model="filters.selectedYear"
        :options="years"
        placeholder="Select..."
        :disabled="!!searchedText.length"
      ></multiselect>
    </div>
    <div style="display: inline-block; padding-left: 15px;">
      <label class="typo__label">Genres</label>
      <multiselect
        v-model="filters.selectedGenres"
        :options="genres"
        :multiple="true"
        :close-on-select="false"
        placeholder="Select..."
        label="name"
        track-by="name"
        :disabled="!!searchedText.length"
      ></multiselect>
    </div>
    <div style="display: inline-block; padding-left: 15px;">
      <label>OR search by title:</label>
      <input
        style="margin-left: 15px;"
        type="text"
        id="searchedText"
        v-model="searchedText"
        placeholder="Search a movie title..."
      />
      <span v-if="warningMessageText">{{ warningMessageText }}</span>
    </div>
  </div>
</template>

<script>
/**
 * @TODO if enough time, add "sort by" filter
 */
import Multiselect from "vue-multiselect";
import config from "@/config";
export default {
  name: "MovieFilters",
  components: {
    Multiselect
  },
  props: {
    genres: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      filters: {
        includeUpcoming: false,
        selectedGenres: [],
        selectedYear: null
      },
      searchedText: "",
      updateTimer: false,
      warningMessageText: null
    };
  },
  computed: {
    years() {
      const maxYear = new Date().getFullYear() + 11;
      return Array.from(
        { length: maxYear - config.MIN_MOVIE_YEAR },
        (value, index) => config.MIN_MOVIE_YEAR + index
      );
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.$emit("updateFilters", this.filters);
      }
    },
    searchedText: function() {
      this.debounceUpdateText(this.searchedText);
    }
  },
  methods: {
    debounceUpdateText(text) {
      // Wait 1 second to update the list to avoid emitting too many requests to the API
      // It gives time to the user to enter his search without sending requests at each letter entered (or removed)
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.warningMessageText =
          text.length && text.length <= 2
            ? "Enter at least 3 characters"
            : null;
        if (!text.length || text.length <= 2) {
          this.$emit("updateFilters", this.filters);
          return;
        }
        if (text.length > 2) {
          this.$emit("updateSearchedMovies", text);
        }
      }, 1000);
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped></style>
