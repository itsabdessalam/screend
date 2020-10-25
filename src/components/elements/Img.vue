<template>
  <div class="img__lazyload__wrapper">
    <div v-if="dataSrc" class="img__placeholder ">
      <img :src="placeholder || dataSrc" alt="" v-bind="$attrs" />
    </div>
    <img :src="dataSrc" :alt="$attrs.alt || ''" v-bind="$attrs" class="img" />
  </div>
</template>

<script>
export default {
  name: "Img",
  props: {
    src: {
      type: String,
      required: true
    },
    placeholder: String
  },
  computed: {
    dataSrc() {
      const { width, height } = this.$attrs;

      if (!width || !height) {
        return "";
      }

      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = (height / width) * 100;

      return canvas.toDataURL();
    }
  },
  mounted() {
    const { src, srcset, $el } = this;
    let lazyloadTimeout;

    const observer = new IntersectionObserver(([entry]) => {
      const img = $el.querySelector(".img");
      const placeholder = $el.querySelector(".img__placeholder");

      img.onload = function() {
        delete img.onload;

        $el.classList.add(`img__lazyload__wrapper--loaded`);
        img.classList.add(`img--loaded`);

        if (placeholder) {
          lazyloadTimeout = setTimeout(() => {
            placeholder.remove();
          }, 250);
        }
      };

      if (entry.isIntersecting) {
        if (srcset) {
          img.srcset = srcset;
        }

        img.src = src;
        observer.disconnect();
      }
    });

    observer.observe($el);

    this.$once("hook:beforeDestroy", () => {
      observer.disconnect();

      if (lazyloadTimeout) {
        clearTimeout(lazyloadTimeout);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.img {
  display: inline-block;
  position: relative;
  opacity: 0;
  transition: opacity 300ms ease;

  &--loaded {
    opacity: 1;
  }
}

.img__placeholder {
  position: absolute;
  overflow: hidden;
}

.img__placeholder .img {
  transform: scale(1.05);
  filter: blur(10px);
}
</style>
