<template>
  <!-- Display the page if we have the billboard movie at least -->
  <div v-if="billboardMovie">
    <section class="hero">
      <Billboard :movie="billboardMovie" />
    </section>
    <div class="views">
      <section v-if="watchlist && watchlist.length" class="my-list">
        <div class="section__header">
          <h2 class="section__title">My list</h2>
          <div class="section__actions">
            <router-link to="/watchlist">View all</router-link>
          </div>
        </div>
        <div class="section__content">
          <Slider>
            <MovieItem
              v-for="movie in watchlist.slice(0, 20)"
              :key="movie.id"
              :movie="movie"
              type="backdrop"
            ></MovieItem>
          </Slider>
        </div>
      </section>
      <MovieSection
        v-for="(section, idx) in moviesSections"
        :key="idx"
        :section="section"
      />
    </div>
  </div>
  <Loader v-else />
</template>

<script>
import {
  Billboard,
  Slider,
  MovieItem,
  MovieSection,
  Loader
} from "@/components";
import { mapGetters } from "vuex";

import { MOVIES_SECTIONS } from "@/config";

import MovieService from "@/services/MovieService";

export default {
  name: "Home",
  components: {
    Billboard,
    Slider,
    MovieItem,
    MovieSection,
    Loader
  },
  data() {
    return {
      billboardMovie: null,
      moviesSections: MOVIES_SECTIONS
    };
  },
  computed: {
    ...mapGetters(["watchlist"])
  },
  created() {
    MovieService.getMovieDetails(8871)
      .then(response => {
        this.billboardMovie = response;
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>

<style lang="scss">
section {
  .section__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding: 0 60px;
  }

  .section__actions {
    a {
      color: #ffffff;
    }
  }

  .section__title {
    font-size: 22px;
    margin: 0;
  }
}

.views {
  transform: translateY(-15vh);
  position: relative;
  z-index: 1070;

  section {
    min-height: 150px;

    &:not(:last-child) {
      margin-bottom: 48px;
    }
  }
}
</style>
