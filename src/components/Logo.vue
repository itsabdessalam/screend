<template>
  <router-link class="logo" to="/">
    <img src="@/assets/images/screend-white-full.png" alt="Screend logo" />
  </router-link>
</template>

<script>
export default {
  name: "Logo"
};
</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  width: 100%;

  > img {
    width: 160px;
    height: auto;
  }
}
</style>
