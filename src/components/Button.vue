<template>
  <button class="button" @click.prevent="submit($event)">
    <slot />
  </button>
</template>

<script>
export default {
  name: "Button",
  inheritAttrs: true,
  methods: {
    submit(event) {
      this.$emit("click", event);
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  background-color: transparent;

  &--primary {
    background-color: $primary !important;
  }

  &--secondary {
    background-color: $secondary !important;
    color: #ffffff !important;
  }
}
</style>
