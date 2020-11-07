<template>
  <div>
    <button v-if="areFiltersUpdated" @click="resetFilters">
      Reset filters
    </button>
    <input
      type="checkbox"
      id="checkbox"
      v-model="mutableFilters.includeUpcoming"
      :disabled="!!searchedText.length"
    />
    <label for="checkbox">include incoming movies</label>

    <div style="display: inline-block; padding-left: 15px;">
      <label class="typo__label">Release year</label>
      <multiselect
        v-model="mutableFilters.selectedYear"
        :options="years"
        placeholder="Select..."
        :disabled="!!searchedText.length"
      ></multiselect>
    </div>
    <div style="display: inline-block; padding-left: 15px;">
      <label class="typo__label">Genres</label>
      <multiselect
        v-model="mutableFilters.selectedGenres"
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
        v-model="mutableSearchedText"
        placeholder="Search a movie title..."
      />
      <span v-if="warningMessageText">{{ warningMessageText }}</span>
    </div>
    <div style="display: inline-block; float: right; padding-right: 50px;">
      <label class="typo__label">Sort by:</label>
      <multiselect
        v-model="mutableFilters.sortBy"
        :value="mutableFilters.sortBy"
        :options="sortByFilters"
        :searchable="false"
        :allow-empty="false"
        label="label"
        track-by="label"
        placeholder="Select..."
        :disabled="!!searchedText.length"
      ></multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import config from "@/config";
import { mapGetters } from "vuex";

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
      mutableFilters: config.DEFAULT_FILTERS,
      mutableSearchedText: "",
      sortByFilters: Object.values(config.SORT_BY_FILTERS).flat(),
      updateTimer: false,
      warningMessageText: null
    };
  },
  computed: {
    ...mapGetters(["filters", "searchedText"]),
    areFiltersUpdated() {
      if (this.mutableSearchedText.length) {
        return true;
      }
      for (const key of Object.keys(this.mutableFilters)) {
        if (
          JSON.stringify(this.mutableFilters[key]) !==
          JSON.stringify(config.DEFAULT_FILTERS[key])
        ) {
          return true;
        }
      }
      return false;
    },
    years() {
      const maxYear = new Date().getFullYear() + 11;
      return Array.from(
        { length: maxYear - config.MIN_MOVIE_YEAR },
        (value, index) => config.MIN_MOVIE_YEAR + index
      );
    }
  },
  created() {
    this.initFromStore();
  },
  watch: {
    mutableFilters: {
      deep: true,
      handler() {
        this.$store.commit("UPDATE_FILTERS", this.mutableFilters);
        if (!this.mutableSearchedText.length) {
          this.$emit("updateFilters", this.mutableFilters);
        }
      }
    },
    mutableSearchedText: function() {
      this.debounceUpdateText(this.mutableSearchedText);
    }
  },
  methods: {
    debounceUpdateText(text) {
      this.$store.commit("UPDATE_SEARCHED_TEXT", text);
      // Wait 1 second to update the list to avoid emitting too many requests to the API
      // It gives time to the user to enter his search without sending requests at each letter entered (or removed)
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.warningMessageText =
          text.length && text.length <= 2
            ? "Enter at least 3 characters"
            : null;
        if (!text.length || text.length <= 2) {
          this.$emit("updateFilters", this.mutableFilters);
          return;
        }
        if (text.length > 2) {
          this.$emit("updateSearchedMovies", text);
        }
      }, 1000);
    },
    initFromStore() {
      this.mutableSearchedText = this.searchedText;
      this.mutableFilters = JSON.parse(JSON.stringify(this.filters));
    },
    resetFilters() {
      this.$store.commit("RESET_FILTERS");
      this.initFromStore();
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped></style>
