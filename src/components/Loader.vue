<template>
  <div class="loader">
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
    <div class="dot dot3"></div>
    <div class="dot dot4"></div>
  </div>
</template>

<script>
export default {
  name: "Loader"
};
</script>

<style lang="scss" scoped>
.loader {
  width: 36px;
  height: 10px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  position: absolute;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: $primary;
    position: absolute;
    animation-duration: 0.6s;
    animation-timing-function: easeOutExpo;
    animation-iteration-count: infinite;
  }

  .dot1,
  .dot2 {
    left: 0;
  }

  .dot3 {
    left: 13px;
  }

  .dot4 {
    left: 26px;
  }

  .dot1 {
    animation-name: show;
  }

  .dot2,
  .dot3 {
    animation-name: slide;
  }

  .dot4 {
    animation-name: hide;
  }
}

@keyframes show {
  0% {
    opacity: 0;
  }
  30% {
    transform: scale(1.2);
  }
  90% {
    transform: scale(1);
  }
  100% {
    opacity: 1;
  }
}

@keyframes hide {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes slide {
  40% {
    transform: translateX(14px);
  }
  100% {
    transform: translateX(13px);
  }
}
</style>
