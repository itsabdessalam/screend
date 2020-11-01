<template>
  <div class="slider">
    <div
      class="slider__control slider__control--left"
      v-show="scrolled && showSlideLeft"
    >
      <button class="slider__control__button" @click="previous">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>
    </div>
    <div class="slider__items"><slot /></div>
    <div class="slider__control slider__control--right" v-show="showSlideRight">
      <button class="slider__control__button" @click="next">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { getWindowSize, getSize } from "@/utils/dom";

export default {
  name: "Slider",
  data() {
    return {
      slider: null,
      scroll: 0,
      scrolled: false,
      showSlideRight: true,
      showSlideLeft: true
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      // selectors should be queried on each update
      this.slider = this.$el.querySelector(".slider__items");
      const [windowWidth] = getWindowSize();

      if (this.slider.scrollWidth > windowWidth) {
        this.showSlideRight = true;
      }

      window.addEventListener("resize", this.onResize);
      this.slider.addEventListener("scroll", this.onScroll);

      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("resize", this.onResize);
        this.slider.removeEventListener("scroll", this.onScroll);
      });
    },
    next() {
      const [slideWidth] = getSize(this.slider.querySelector(".slider__item"));
      const [windowWidth] = getWindowSize();

      this.scroll = this.slider.scrollLeft;
      this.scrolled = true;
      this.showSlideLeft = true;

      if (
        this.slider.scrollLeft + windowWidth + slideWidth >=
        this.slider.scrollWidth
      ) {
        this.showSlideRight = false;
      }

      this.slider.scrollLeft = this.scroll + windowWidth;
    },
    previous() {
      const [windowWidth] = getWindowSize();

      this.scroll = this.slider.scrollLeft;
      this.scrolled = true;
      this.showSlideRight = true;

      if (this.slider.scrollLeft <= windowWidth) {
        this.showSlideLeft = false;
      }

      this.slider.scrollLeft = this.scroll - windowWidth;
    },
    onResize() {
      const [windowWidth] = getWindowSize();

      this.scroll = 0;
      this.scrolled = false;
      this.showSlideLeft = false;

      if (this.slider.scrollWidth > windowWidth) {
        this.showSlideRight = true;
      }

      this.slider.scrollTo(0, 0);
    },
    onScroll() {
      const [windowWidth] = getWindowSize();

      this.scrolled = true;
      this.showSlideLeft = true;
      this.showSlideRight = true;

      if (this.slider.scrollLeft <= 100) {
        this.showSlideLeft = false;
      }

      if (this.slider.scrollWidth - this.slider.scrollLeft === windowWidth) {
        this.showSlideRight = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  width: 100%;

  .slider__items {
    position: relative;
    width: 100%;
    height: auto;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: scroll;
    scroll-padding: 60px;
    line-height: 0;
    transform: translateZ(0);
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none !important;
    }

    .slider__item {
      position: relative;
      display: inline-block;
      width: calc(40vh - 60px);
      height: auto;
      overflow: auto;
      cursor: pointer;
      z-index: 950;

      &:first-child {
        margin-left: 60px;
      }

      &:not(:first-child) {
        margin-left: 6px;
      }

      @media (min-width: 768px) {
        width: 16.66666667%;
      }
    }
  }

  .slider__control {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1000;
    width: 10%;
    padding: 0;
    margin: 0;
    text-align: center;
    outline: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity 0.25s ease, background-color 0.25s ease;

    &--right {
      right: 0;
      justify-content: flex-end;
      background: linear-gradient(90deg, rgba(#000000, 0), rgba(#000000, 1));
    }

    &--left {
      left: 0;
      justify-content: flex-start;
      background: linear-gradient(-90deg, rgba(#000000, 0), rgba(#000000, 1));
    }

    .slider__control__button {
      display: flex;
      align-items: center;
      height: 100%;
      background: transparent;
      outline: none;
      color: #ffffff;
      padding: 0 22px;

      > svg {
        width: 24px;
      }
    }
  }
}
</style>