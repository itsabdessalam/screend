<template>
  <div class="player">
    <div class="player__placeholder">
      <img src="@/assets/images/screend-white.png" alt="Screend logo" />
    </div>
    <iframe
      class="player__iframe"
      width="100%"
      height="100%"
      :src="
        `https://www.youtube.com/embed/${id}?start=1&rel=0&showinfo=0&autoplay=1&controls=0`
      "
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen="allowfullscreen"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "Player",
  props: {
    id: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.player {
  position: relative;
  padding-bottom: 56.25%;
  background-color: #000000;
  z-index: 1200;

  .player__iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: all;
  }

  .player__placeholder {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      width: 150px;
    }
  }
}
</style>
