<template>
  <div class="loader">
    <div class="loader__circle"></div>
    <!-- <img src="@/assets/images/screend-white.png" alt="Screend logo" /> -->
  </div>
</template>

<script>
export default {
  name: "Loader"
};
</script>

<style lang="scss" scoped>
.loader {
  width: 70px;
  height: 70px;
  margin: auto;
  display: block;
  position: relative;
  background-image: url("~@/assets/images/screend-loader.png");
  background-size: 40px;
  background-position: center;
  background-repeat: no-repeat;

  .loader__circle {
    width: 70px;
    height: 70px;
    animation: circle infinite 0.75s linear;
    border: 4px solid $primary;
    border-top-color: transparent;
    border-radius: 100%;
  }
}

@keyframes circle {
  0% {
    -webkit-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
