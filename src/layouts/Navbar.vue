<template>
  <div class="navbar">
    <div class="navbarbar__left">
      <Logo />
    </div>
    <div class="navbar__right">
      <ul class="navbar__links">
        <router-link class="navbar__link" to="/">Home</router-link>
        <router-link class="navbar__link" to="/movies">Movies</router-link>
        <router-link class="navbar__link" to="/watchlist">My list</router-link>
        <router-link class="navbar__link" to="/account">Account</router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import { Logo } from "@/components";

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
  height: 100px;
  padding: 0 60px;
  z-index: 1100;

  .navbar__links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

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
