<template>
  <!-- Display the page if we have the billboard movie at least -->
  <div>
    <div v-show="billboardLoaded && allSectionsLoaded">
      <section v-if="billboardMovie" class="hero">
        <Billboard :movie="billboardMovie" />
      </section>
      <div v-if="moviesSections.length" class="views">
        <section v-if="watchlist && watchlist.length" class="my-list">
          <div class="section__header">
            <h2 class="section__title">My list</h2>
            <div class="section__actions">
              <router-link to="/watchlist"
                >View all
                <svg
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
              ></router-link>
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
          @loadSection="loadSection"
        />
      </div>
    </div>
    <Loader v-show="!billboardLoaded || !allSectionsLoaded" />
  </div>
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
      billboardLoaded: false,
      allSectionsLoaded: false,
      loadedSections: 0,
      moviesSections: MOVIES_SECTIONS,
      moviesSectionsCount: MOVIES_SECTIONS.length
    };
  },
  computed: {
    ...mapGetters(["watchlist"])
  },
  created() {
    MovieService.getMovieDetails(741074)
      .then(response => {
        this.billboardMovie = response;
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        this.billboardLoaded = true;
      });
  },
  methods: {
    loadSection(title) {
      if (this.moviesSections.find(section => section.title === title))
        this.loadedSections++;
      if (this.loadedSections === this.moviesSectionsCount) {
        this.allSectionsLoaded = true;

        // Trigger resize event to setup slider after all elements are displayed
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 500);
      }
    }
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
      display: flex;
      color: #ffffff;

      > svg {
        width: 14px;
        margin-left: 8px;
      }
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
