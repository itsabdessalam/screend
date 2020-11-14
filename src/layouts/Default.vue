<template>
  <div
    id="app"
    class="app layout"
    :data-page="$route.name"
    :data-device="device"
    :key="$route.fullPath"
  >
    <div class="app__view">
      <Header />
      <main class="content">
        <slot />
      </main>
      <span id="device" class="screen-only"></span>
    </div>
    <div class="app__layer">
      <span class="app__message">
        Our website is not available for smartphone.
      </span>
      <span class="app__help">
        Check it out on desktop or tablet.
      </span>
    </div>
  </div>
</template>
<script>
import Header from "./Header";

export default {
  components: {
    Header
  },
  data() {
    return {
      device: "desktop"
    };
  },
  mounted() {
    this.setDevice();
    window.addEventListener("resize", this.setDevice);

    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("resize", this.setDevice);
    });
  },
  methods: {
    setDevice() {
      const device = getComputedStyle(
        document.getElementById("device"),
        ":after"
      ).content.replace(/"/g, "");

      if (this.device !== device) {
        this.device = device;
      }
    }
  }
};
</script>

<style lang="scss">
.layout {
  margin: 0 auto;
  height: 100%;
  display: block;

  .content {
    min-height: calc(100vh - 100px);
    height: 100%;
    display: block;
  }

  &[data-page="movies"],
  &[data-page="movie-details"],
  &[data-page="watchlist"] {
    .content {
      padding: 60px 60px 0 60px;
    }
  }

  .app__layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .app__message,
    .app__help {
      text-align: center;
    }
  }

  @media (orientation: portrait) and (max-width: $tablet),
    (orientation: landscape) and (max-width: $tablet) {
    .app__view {
      display: none;
    }

    .app__layer {
      display: flex;
    }
  }
}
</style>
