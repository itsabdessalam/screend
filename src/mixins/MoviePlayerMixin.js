export default {
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    video() {
      const { results = [] } = this.movie && this.movie.videos;
      const trailer = results.find(
        item => item.site === "YouTube" && item.type === "Trailer"
      );

      if (trailer) {
        return {
          id: trailer.key
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
