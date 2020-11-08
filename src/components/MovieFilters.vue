<template>
  <div class="movie__filters">
    <div class="movie__filters__inner">
      <Multiselect
        v-model="mutableFilters.selectedYear"
        :options="years"
        placeholder="Release year"
        :disabled="!!searchedText.length"
        class="movie__filter movie__filter--release"
      />
      <Multiselect
        v-model="mutableFilters.selectedGenres"
        :options="genres"
        :multiple="true"
        :close-on-select="false"
        placeholder="Genres"
        label="name"
        track-by="name"
        :disabled="!!searchedText.length"
        class="movie__filter movie__filter--genre"
      />
      <Multiselect
        v-model="mutableFilters.sortBy"
        :value="mutableFilters.sortBy"
        :options="sortByFilters"
        :searchable="false"
        :allow-empty="false"
        label="label"
        track-by="label"
        placeholder="Select..."
        :disabled="!!searchedText.length"
        class="movie__filter movie__filter--sort"
      ></Multiselect>
      <div class="movie__filter movie__filter--upcoming">
        <input
          type="checkbox"
          id="toggle"
          v-model="filters.includeUpcoming"
          :disabled="!!searchedText.length"
        />
        <label
          for="toggle"
          :class="!!searchedText.length ? 'unchecked' : 'checked'"
          >Include incoming movies</label
        >
      </div>
      <div class="movie__filter movie__filter--separator">
        <span>OR</span>
      </div>
      <div class="movie__filter movie__search">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          type="text"
          id="searchedText"
          v-model="mutableSearchedText"
          placeholder="Search by title"
          class="movie__filter movie__filter--search"
        />
        <button
          v-if="areFiltersUpdated"
          @click="resetFilters"
          class="movie__filter movie__filter--reset"
        >
          Clear
        </button>
      </div>
    </div>

    <span v-if="warningMessageText">{{ warningMessageText }}</span>
  </div>
</template>

<script>
import Multiselect from "./Multiselect";
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
<style lang="scss" scoped>
.movie__filters {
  .movie__filters__inner {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;

    .movie__filter {
      flex: 1;
    }
  }

  #searchedText {
    background-color: #ffffff;
    border: 1px solid #dde2ec;
    color: #15161c;
    padding: 12px;
    padding-left: 32px;
    border-radius: 4px;
    width: 100%;
    display: block;
    font-size: 16px;
    text-align: left;
    height: 47px;
    -webkit-appearance: none;
    outline: 0;
  }

  #toggle {
    position: absolute;
    left: -100vw;
  }

  #toggle:checked ~ label {
    background-color: $primary;
    border-color: $primary;
  }

  label {
    background-color: $secondary;
    padding: 12px;
    border-radius: 4px;
    font-size: 16px;
    border: 1px solid $secondary;
    cursor: pointer;

    &.unchecked {
      background-color: $secondary;
      border-color: $secondary;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .movie__filter {
    &:not(:first-child) {
      margin-left: 6px;
    }
  }

  .movie__filter--release {
    max-width: 170px;
  }

  .movie__filter--genre {
    max-width: 400px;
  }

  .movie__filter--search {
    margin-left: 0 !important;
    max-width: 300px;
  }

  .movie__filter--upcoming {
    max-width: 205px;
  }

  .movie__filter--sort {
    max-width: 170px;
  }

  .movie__filter--separator {
    max-width: 30px;
  }

  .movie__search {
    position: relative;
    max-width: 300px;
    margin-left: 2px !important;

    svg {
      color: #15161c;
      opacity: 0.7;
      width: 18px;
      position: absolute;
      left: 10px;
      top: 14px;
    }

    .movie__filter--reset {
      position: absolute;
      top: -20px;
      right: 0;
      background-color: transparent;
      color: $primary;
      text-align: right;
      padding: 0;
    }
  }
}
</style>
