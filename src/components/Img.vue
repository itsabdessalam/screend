<template>
  <div class="image__wrapper">
    <img src="" :alt="$attrs.alt || ''" v-bind="$attrs" class="image__item" />
  </div>
</template>

<script>
import { BASE_IMAGE_URL, IMAGES_SIZES } from "@/config";
import Placeholder from "@/assets/images/screend-placeholder.jpg";

export default {
  name: "Img",
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "none"
    }
  },
  mounted() {
    let { $el, src, type } = this;

    if (Object.keys(IMAGES_SIZES).indexOf(type) !== -1) {
      let size = IMAGES_SIZES[type] || IMAGES_SIZES["default"];

      if (src) {
        src = `${BASE_IMAGE_URL}/${size}${src}`;
      } else {
        src = Placeholder;
      }
    }

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
.image__wrapper {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  .image__item {
    display: inline-block;
    position: relative;
    opacity: 0;
    transition: opacity 300ms ease;

    &--loaded {
      opacity: 1;
    }
  }
}
</style>
