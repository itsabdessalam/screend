<template>
  <div
    id="app"
    class="layout"
    :data-page="$route.name"
    :data-device="device"
    :key="$route.fullPath"
  >
    <Header />
    <main class="content">
      <slot />
    </main>
    <Footer />
    <span id="device" class="screen-only"></span>
  </div>
</template>
<script>
import Header from "./Header";
import Footer from "./Footer";

// import MovieService from "@/services/MovieService"

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      device: "desktop"
    };
  },
  created() {
    // MovieService.getMovieSearchList("ava").then(response => {
    //   console.log(response);
    // });
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
  .content {
    min-height: calc(100vh - 300px);
  }
}
</style>
