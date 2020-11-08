<template>
  <div class="billboard">
    <Modal v-if="video && showModal" @close="closeModal">
      <template #body>
        <Player :id="video.id" />
      </template>
    </Modal>
    <div class="billboard__inner">
      <div class="billboard__meta col-5">
        <div>
          <h2 class="billboard__title">
            {{ movie.title || movie.original_title }}
          </h2>
          <div class="billboard__subtitle">
            <div class="billboard__rate">
              <IMDbIcon />
              <span>{{ movie.vote_average }}</span>
            </div>
            <span class="billboard__reviews">
              {{ movie.vote_count }} Reviews</span
            >
            <span class="dot">•</span>
            <span class="billboard__release">
              {{ movie.release_date | year }}
            </span>
          </div>

          <p class="billboard__overview">
            {{ movie.overview | truncate(200) }}
          </p>
          <div class="billboard__actions">
            <router-link
              :to="`/movies/${movie.id}`"
              class="billboard__action billboard__action--details"
            >
              View details
            </router-link>
            <div v-if="video">
              <button
                id="show-modal"
                class="billboard__action billboard__action--trailer"
                @click="openModal"
              >
                Watch trailer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="billboard__backdrop col-7">
        <Img
          :src="`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`"
          :alt="movie.original_title"
        />
      </div>
    </div>
    <div class="billboard__overlay"></div>
  </div>
</template>

<script>
import Modal from "./Modal";
import Player from "./Player";
import { IMDb as IMDbIcon } from "@/icons";

export default {
  name: "Billboard",
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  components: {
    Modal,
    Player,
    IMDbIcon
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    video() {
      if (
        this.movie.videos &&
        this.movie.videos.results &&
        this.movie.videos.results[0].site === "YouTube" &&
        this.movie.videos.results[0].type === "Trailer"
      ) {
        return {
          id: this.movie.videos.results[0].key
        };
      }

      return null;
    }
  },
  created() {
    document.addEventListener("keydown", this.onEscape, false);
    document.addEventListener("click", this.onClickOutside, false);

    this.$once("hook:beforeDestroy", () => {
      document.removeEventListener("keydown", this.onEscape, false);
      document.removeEventListener("click", this.onClickOutside, false);
    });
  },
  methods: {
    onEscape(event) {
      if (event.keyCode === 27) {
        this.closeModal();
      }
    },
    onClickOutside(event) {
      if (event.target.classList.contains("modal__backdrop")) {
        this.closeModal();
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.billboard {
  position: relative;
  height: 100vh;
  margin-top: -100px;
  background-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );

  .billboard__inner,
  .billboard__meta,
  .billboard__backdrop,
  .billboard__backdrop .image__wrapper,
  .billboard__backdrop .image__wrapper > img {
    width: 100%;
    height: 100%;
  }

  .billboard__meta {
    display: flex;
    align-items: center;
    padding: 0 0 0 60px;
    z-index: 1070;

    .billboard__title {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .billboard__subtitle {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .billboard__rate {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 4px;
        border: 1px solid $primary;
        color: $primary;
        font-size: 12px;
        font-weight: 500;
        width: 66px;
        padding: 0 6px 0 0px;
        line-height: 22px;
        margin-right: 12px;

        > svg {
          width: 38px;
          height: auto;
        }
      }

      .billboard__reviews,
      .billboard__release,
      .dot {
        font-size: 14px;
        color: #ffffff;
        opacity: 0.7;
      }
    }
  }

  .billboard__actions {
    display: flex;
    margin-top: 32px;

    .billboard__action {
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      background-color: transparent;

      &--details {
        background-color: #525253;
        color: #ffffff;
        margin-right: 12px;
      }

      &--trailer {
        background-color: $primary;
      }
    }
  }

  .billboard__backdrop {
    padding: 0;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      background-image: linear-gradient(
        90deg,
        #000 0,
        transparent 50%,
        transparent
      );
    }
  }

  .billboard__inner {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      background-image: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      );

      z-index: 1000;
    }
  }

  .billboard__overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    background-image: linear-gradient(0, #000 0, transparent 50%, transparent);
    z-index: 1000;
  }
}
</style>
