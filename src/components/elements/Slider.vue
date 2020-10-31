<template>
  <div class="slider">
    <div class="slider__items">
      <slot />
    </div>
    <div class="slider__controls">
      <div class="slider__controls__prev"></div>
      <div class="slider__controls__next"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Slider",
  data() {
    return {
      slides: [],
      intervalId: null
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {},
    next() {},
    previous() {},
    clear() {}
  }
};
</script>

<style lang="scss" scoped></style>
