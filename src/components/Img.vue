<template>
  <div class="image__wrapper">
    <img src="" :alt="$attrs.alt || ''" v-bind="$attrs" class="image__item" />
  </div>
</template>

<script>
export default {
  name: "Img",
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      required: true
    }
  },
  mounted() {
    const { $el, src } = this;

    const observer = new IntersectionObserver(([entry]) => {
      const image = $el.querySelector(".image__item");

      if (image) {
        image.addEventListener("load", () => {
          setTimeout(() => image.classList.add("image__item--loaded"), 100);
        });
      }

      if (entry.isIntersecting) {
        image.src = src;
        observer.disconnect();
      }
    });

    observer.observe($el);

    this.$once("hook:beforeDestroy", () => {
      observer.disconnect();
    });
  }
};
</script>

<style lang="scss" scoped>
.image__item {
  display: inline-block;
  position: relative;
  opacity: 0;
  transition: opacity 300ms ease;

  &--loaded {
    opacity: 1;
  }
}
</style>
