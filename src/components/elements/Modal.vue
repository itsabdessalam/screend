<template>
  <transition>
    <div class="modal__backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header v-if="withHeader" class="modal-header" id="modalTitle">
          <slot name="header">
            Default header
            <button
              type="button"
              class="close-modal"
              @click="$emit('close')"
              aria-label="Close modal"
            >
              X
            </button>
          </slot>
        </header>
        <section class="modal__body" id="modalDescription">
          <slot name="body">
            Default body
          </slot>
        </section>
        <footer v-if="withFooter" class="modal__footer">
          <slot name="footer">
            Default footer
            <button
              type="button"
              class="button"
              @click="$emit('close')"
              aria-label="Close modal"
            >
              Close
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    withHeader: {
      type: Boolean,
      default: false
    },
    withFooter: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.modal__backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1090;
}

.modal {
  min-width: 80vw;
  min-height: 40vw;
  max-width: 1280px;
  max-height: calc(100% - 96px);
  flex: 0 1 auto;
  background: #ffffff;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.16),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1092;
}

.modal__header,
.modal__footer {
  padding: 40px;
  display: flex;
}

.modal__header {
  font-weight: 500;
  color: $text;
  justify-content: space-between;
  font-size: 24px;
}

.modal__footer {
  padding: 20px 40px 40px 40px;
  justify-content: flex-end;

  > *:not(:last-child) {
    margin-right: 10px;
  }
}

.modal__body {
  position: relative;
  pointer-events: none;
}
</style>
