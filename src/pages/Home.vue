<template>
  <div v-if="movies.length">
    <section class="hero">
      <!-- Only for display movies[0] -->
      <Billboard :movie="movies[0]" />
    </section>
    <div class="views">
      <section class="my-list">
        <div class="section__header">
          <h2 class="section__title">My list</h2>
          <div class="section__actions">
            <router-link to="/watchlist">View all</router-link>
          </div>
        </div>
        <div class="section__content">
          <Slider>
            <!-- Only for display, we remove the first item -->
            <MovieItem
              v-for="movie in movies.slice(1)"
              :key="movie.id"
              :movie="movie"
              type="backdrop"
            ></MovieItem>
          </Slider>
        </div>
      </section>
      <section class="latest">
        <div class="section__header">
          <h2 class="section__title">Latest</h2>
          <div class="section__actions">
            <router-link to="/movies">View all</router-link>
          </div>
        </div>
        <div class="section__content">
          <Slider>
            <MovieItem
              v-for="movie in movies.slice(1)"
              :key="movie.id"
              :movie="movie"
            ></MovieItem>
          </Slider>
        </div>
      </section>
      <section class="most-watched">
        <div class="section__header">
          <h2 class="section__title">Most watched</h2>
          <div class="section__actions">
            <router-link to="/movies">View all</router-link>
          </div>
        </div>
        <div class="section__content">
          <Slider>
            <MovieItem
              v-for="movie in movies.slice(1)"
              :key="movie.id"
              :movie="movie"
            ></MovieItem>
          </Slider>
        </div>
      </section>
      <section class="trending-now">
        <div class="section__header">
          <h2 class="section__title">Trending now</h2>
          <div class="section__actions">
            <router-link to="/movies">View all</router-link>
          </div>
        </div>
        <div class="section__content">
          <Slider>
            <MovieItem
              v-for="movie in movies.slice(1)"
              :key="movie.id"
              :movie="movie"
            ></MovieItem>
          </Slider>
        </div>
      </section>
      <section class="upcoming">
        <div class="section__header">
          <h2 class="section__title">Upcoming</h2>
          <div class="section__actions">
            <router-link to="/movies">View all</router-link>
          </div>
        </div>
        <div class="section__content">
          <Slider>
            <MovieItem
              v-for="movie in movies.slice(1)"
              :key="movie.id"
              :movie="movie"
            ></MovieItem>
          </Slider>
        </div>
      </section>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { Billboard, Slider, MovieItem } from "@/components";

// Temporary data mock only for display
import moviesData from "@/mock/movies.json";

export default {
  name: "Home",
  components: {
    Billboard,
    Slider,
    MovieItem
  },
  data() {
    return {
      movies: moviesData.results || []
    };
  }
};
</script>

<style lang="scss" scoped>
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
  z-index: 1000;

  section {
    min-height: 150px;

    &:not(:last-child) {
      margin-bottom: 48px;
    }
  }
}
</style>
