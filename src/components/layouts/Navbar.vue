<template>
  <div class="navbar">
    <div class="navbarbar__left">
      <Logo />
    </div>
    <div class="navbar__right">
      <ul class="navbar__links">
        <router-link class="navbar__link" to="/movies">Movies</router-link>
        <router-link class="navbar__link" to="/latest">Latest</router-link>
        <router-link class="navbar__link" to="/my-list">My list</router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import { Logo } from "@/components/elements";

export default {
  name: "Navbar",
  components: {
    Logo
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  height: 80px;
  padding: 0 60px;
  z-index: 1072;

  .navbar__links {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navbar__link {
      color: #ffffff;
      text-decoration: none;

      &:not(:first-child) {
        margin-left: 24px;
      }
    }
  }
}
</style>
