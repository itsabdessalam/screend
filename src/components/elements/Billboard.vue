<template>
  <div class="billboard">
    <div class="billboard__inner">
      <div class="billboard__meta col-5">
        <div>
          <h2 class="billboard__title">
            {{ movie.title || movie.original_title }}
          </h2>
          <p class="billboard__overview">
            {{ movie.overview | truncate(250) }}
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
                @click="showModal = true"
              >
                Watch trailer
              </button>
              <Modal v-if="showModal" @close="toggleModal">
                <template #body>
                  <Player :id="video.id" />
                </template>
              </Modal>
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
  </div>
</template>

<script>
import Modal from "@/components/elements/Modal";
import Player from "@/components/elements/Player";

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
    Player
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
        this.toggleModal();
      }
    },
    onClickOutside(event) {
      if (event.target.classList.contains("modal__backdrop")) {
        this.toggleModal();
      }
    },
    toggleModal() {
      this.showModal = !this.showModal;
    }
  }
};
</script>

<style lang="scss" scoped>
.billboard {
  position: relative;
  height: 90vh;
  margin-top: -80px;

  .billboard__inner,
  .billboard__meta,
  .billboard__backdrop,
  .billboard__backdrop .img__lazyload__wrapper,
  .billboard__backdrop .img__lazyload__wrapper > img {
    width: 100%;
    height: 100%;
  }

  .billboard__meta {
    display: flex;
    align-items: center;
    padding: 0 60px;
    background-color: #000000;

    .billboard__title {
      font-size: 56px;
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
        margin-right: 14px;
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
}
</style>
