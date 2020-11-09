export default {
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
        this.movie.videos.results[0] &&
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
