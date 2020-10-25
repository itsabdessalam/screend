<template>
  <div class="nav">
    <div class="nav__links">
      <Logo />
    </div>
  </div>
</template>

<script>
import Logo from "@/components/elements/Logo";

export default {
  components: {
    Logo
  }
};
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  position: fixed;
  width: 100vw;
  height: 102px;
  max-width: 1170px;
  top: 0;
  z-index: 1200;
  background: $background;

  .nav__links {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--desktop {
      width: 100%;
      .nav__links__inner {
        display: flex;
        align-items: center;
      }
    }

    &--mobile {
      display: none;
      width: 100%;

      .nav__link__icons {
        display: flex;
        .nav__link {
          &--icon {
            margin: 0 !important;
          }
        }
      }

      .nav__link__menu {
        z-index: 1092;
        position: relative;
      }

      &.open {
        .nav__link__menu {
          svg {
            fill: #ffffff;
            stroke: #ffffff;
          }
        }
      }

      .nav__links__inner {
        &.visible {
          display: flex;
          position: fixed;
          background: #000;
          width: 100vw;
          height: 100vh;
          top: 0;
          z-index: 1072;
          left: 0;
          color: #fff;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .nav__link {
            margin-left: 0;
            margin-bottom: 12px;
            color: #ffffff;
          }
        }
      }
    }

    .nav__link {
      margin-left: 24px;
      position: relative;

      &--icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 8px;
        background-color: #ffffff;
        border-radius: 50%;
        > svg {
          width: 18px;
          height: 18px;
        }
      }

      &:last-child {
        margin-left: 12px;
      }

      .nav__link__cart__count {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 12px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;
        color: #ffffff;
        border-radius: 50%;
        width: 16px;
        height: 16px;
      }
    }

    .nav__link__menu,
    .nav__link__icons {
      display: flex;
    }
  }
}
</style>
