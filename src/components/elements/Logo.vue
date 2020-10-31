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
  > img {
    width: 180px;
    height: auto;
  }
}
</style>
