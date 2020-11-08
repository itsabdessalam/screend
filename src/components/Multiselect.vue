<!-- Source https://github.com/shentao/vue-multiselect/blob/2.0/src/Multiselect.vue -->
<template>
  <div
    :tabindex="searchable ? -1 : tabindex"
    :class="{
      'multiselect--active': isOpen,
      'multiselect--disabled': disabled,
      'multiselect--above': isAbove
    }"
    @focus="activate()"
    @blur="searchable ? false : deactivate()"
    @keydown.self.down.prevent="pointerForward()"
    @keydown.self.up.prevent="pointerBackward()"
    @keydown.enter.tab.stop.self="addPointerElement($event)"
    @keyup.esc="deactivate()"
    class="multiselect"
  >
    <slot name="caret" :toggle="toggle">
      <div @mousedown.prevent.stop="toggle()" class="multiselect__select"></div>
    </slot>
    <slot name="clear" :search="search"></slot>
    <div ref="tags" class="multiselect__tags" :class="inputContainerClass">
      <div class="multiselect__tags-wrap" v-show="visibleValue.length > 0">
        <template v-for="(option, index) of visibleValue" @mousedown.prevent>
          <slot
            name="tag"
            :option="option"
            :search="search"
            :remove="removeElement"
          >
            <span class="multiselect__tag" :key="index">
              <span v-text="getOptionLabel(option)"></span>
              <i
                aria-hidden="true"
                tabindex="1"
                @keydown.enter.prevent="removeElement(option)"
                @mousedown.prevent="removeElement(option)"
                class="multiselect__tag-icon"
              ></i>
            </span>
          </slot>
        </template>
      </div>
      <template v-if="internalValue && internalValue.length > limit">
        <strong
          class="multiselect__strong"
          v-text="limitText(internalValue.length - limit)"
        ></strong>
      </template>
      <transition name="multiselect__loading">
        <slot name="loading"
          ><div v-show="loading" class="multiselect__spinner"></div
        ></slot>
      </transition>
      <input
        ref="search"
        :name="name"
        :id="id"
        type="text"
        autocomplete="off"
        :placeholder="placeholder"
        v-if="searchable"
        :style="inputStyle"
        :value="isOpen ? search : currentOptionLabel"
        :disabled="disabled"
        :tabindex="tabindex"
        @input="updateSearch($event.target.value)"
        @focus.prevent="activate()"
        @blur.prevent="deactivate()"
        @keyup.esc="deactivate()"
        @keydown.down.prevent="pointerForward()"
        @keydown.up.prevent="pointerBackward()"
        @keydown.enter.prevent.stop.self="addPointerElement($event)"
        @keydown.delete.stop="removeLastElement()"
        class="multiselect__input"
        :class="inputClass"
      />
      <span
        v-if="!searchable"
        class="multiselect__single"
        @mousedown.prevent="toggle"
        v-text="currentOptionLabel"
      >
      </span>
    </div>
    <transition name="multiselect">
      <div
        class="multiselect__content-wrapper"
        v-show="isOpen"
        @focus="activate"
        @mousedown.prevent
        :style="{ maxHeight: optimizedHeight + 'px' }"
        ref="list"
      >
        <ul class="multiselect__content" :style="contentStyle">
          <slot name="beforeList"></slot>
          <li v-if="multiple && max === internalValue.length">
            <span class="multiselect__option">
              <slot name="maxElements"
                >Maximum of {{ max }} options selected. First remove a selected
                option to select another.</slot
              >
            </span>
          </li>
          <template v-if="!max || internalValue.length < max">
            <li
              class="multiselect__element"
              v-for="(option, index) of filteredOptions"
              :key="index"
            >
              <span
                v-if="!(option && (option.$isLabel || option.$isDisabled))"
                :class="optionHighlight(index, option)"
                @click.stop="select(option)"
                @touchstart.stop.prevent="handleTouchStartStop(index, option)"
                @mouseenter.self="pointerSet(index)"
                :data-select="
                  option && option.isTag ? tagPlaceholder : selectLabelText
                "
                :data-selected="selectedLabelText"
                :data-deselect="deselectLabelText"
                class="multiselect__option"
              >
                <slot name="option" :option="option" :search="search">
                  <span>{{ getOptionLabel(option) }}</span>
                </slot>
              </span>
              <span
                v-if="option && (option.$isLabel || option.$isDisabled)"
                :class="optionHighlight(index, option)"
                class="multiselect__option multiselect__option--disabled"
              >
                <slot name="option" :option="option" :search="search">
                  <span>{{ getOptionLabel(option) }}</span>
                </slot>
              </span>
            </li>
          </template>
          <li
            v-show="
              showNoResults &&
                filteredOptions.length === 0 &&
                search &&
                !loading
            "
          >
            <span class="multiselect__option">
              <slot name="noResult"
                >No elements found. Consider changing the search query.</slot
              >
            </span>
          </li>
          <slot name="afterList"></slot>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import MultiselectMixin from "@/mixins/MultiselectMixin";
import PointerMixin from "@/mixins/PointerMixin";

export default {
  name: "Multiselect",
  mixins: [MultiselectMixin, PointerMixin],
  props: {
    /**
     * name attribute to match optional label element
     * @default ''
     * @type {String}
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * String to show when pointing to an option
     * @default 'Press enter to select'
     * @type {String}
     */
    selectLabel: {
      type: String,
      default: "Press enter to select"
    },
    /**
     * String to show next to selected option
     * @default 'Selected'
     * @type {String}
     */
    selectedLabel: {
      type: String,
      default: "Selected"
    },
    /**
     * String to show when pointing to an alredy selected option
     * @default 'Press enter to remove'
     * @type {String}
     */
    deselectLabel: {
      type: String,
      default: "Press enter to remove"
    },
    /**
     * Decide whether to show pointer labels
     * @default true
     * @type {Boolean}
     */
    showLabels: {
      type: Boolean,
      default: true
    },
    /**
     * Limit the display of selected options. The rest will be hidden within the limitText string.
     * @default 99999
     * @type {Integer}
     */
    limit: {
      type: Number,
      default: 99999
    },
    /**
     * Sets maxHeight style value of the dropdown
     * @default 300
     * @type {Integer}
     */
    maxHeight: {
      type: Number,
      default: 300
    },
    /**
     * Function that process the message shown when selected
     * elements pass the defined limit.
     * @default 'and * more'
     * @param {Int} count Number of elements more than limit
     * @type {Function}
     */
    limitText: {
      type: Function,
      default: count => `and ${count} more`
    },
    /**
     * Set true to trigger the loading spinner.
     * @default False
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Disables the multiselect if true.
     * @default false
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Fixed opening direction
     * @default ''
     * @type {String}
     */
    openDirection: {
      type: String,
      default: ""
    },
    showNoResults: {
      type: Boolean,
      default: true
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    visibleValue() {
      return this.multiple ? this.internalValue.slice(0, this.limit) : [];
    },
    deselectLabelText() {
      return this.showLabels ? this.deselectLabel : "";
    },
    selectLabelText() {
      return this.showLabels ? this.selectLabel : "";
    },
    selectedLabelText() {
      return this.showLabels ? this.selectedLabel : "";
    },
    inputStyle() {
      if (this.multiple && this.value && this.value.length) {
        // Hide input by setting the width to 0 allowing it to receive focus
        return this.isOpen
          ? { width: "auto" }
          : { width: "0", position: "absolute" };
      }
      return null;
    },
    contentStyle() {
      return this.options.length
        ? { display: "inline-block" }
        : { display: "block" };
    },
    isAbove() {
      if (this.openDirection === "above" || this.openDirection === "top") {
        return true;
      } else if (
        this.openDirection === "below" ||
        this.openDirection === "bottom"
      ) {
        return false;
      } else {
        return this.prefferedOpenDirection === "above";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
fieldset[disabled] .multiselect {
  pointer-events: none;
}

.multiselect__spinner {
  position: absolute;
  right: 1px;
  top: 1px;
  width: 48px;
  height: 35px;
  background: $secondary;
  display: block;

  &:before,
  &:after {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border-color: $primary transparent transparent;
    border-style: solid;
    border-width: 2px;
    box-shadow: 0 0 0 1px transparent;
  }

  &:before {
    animation: spinning 2.4s cubic-bezier(0.41, 0.26, 0.2, 0.62);
    animation-iteration-count: infinite;
  }

  &:after {
    animation: spinning 2.4s cubic-bezier(0.51, 0.09, 0.21, 0.8);
    animation-iteration-count: infinite;
  }
}

.multiselect__loading-enter-active,
.multiselect__loading-leave-active {
  transition: opacity 0.4s ease-in-out;
  opacity: 1;
}

.multiselect__loading-enter,
.multiselect__loading-leave-active {
  opacity: 0;
}

.multiselect,
.multiselect__input,
.multiselect__single {
  font-family: inherit;
  font-size: 14px;
  touch-action: manipulation;
  color: #ffffff;
}

.multiselect {
  box-sizing: content-box;
  display: block;
  position: relative;
  width: 100%;
  min-height: 47px;
  text-align: left;
  color: #ffffff;

  * {
    box-sizing: border-box;
  }

  &:focus {
    outline: none;
  }

  ::placeholder {
    color: #ffffff;
  }
}

.multiselect--disabled {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.6;
}

.multiselect--active {
  z-index: 50;

  &:not(.multiselect--above) {
    .multiselect__current,
    .multiselect__input,
    .multiselect__tags {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .multiselect__select {
    transform: rotateZ(180deg);
  }
}

.multiselect--above.multiselect--active {
  .multiselect__current,
  .multiselect__input,
  .multiselect__tags {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}

.multiselect__input,
.multiselect__single {
  font-size: 16px;
  position: relative;
  display: inline-block;
  line-height: 22px;
  border: none;
  border-radius: 4px;
  background: $secondary;
  padding: 1px 0 0 5px;
  width: calc(100%);
  transition: border 0.1s ease;
  box-sizing: border-box;
  vertical-align: top;
}

.multiselect__tag ~ {
  .multiselect__input,
  .multiselect__single {
    width: auto;
  }
}

.multiselect__input:hover,
.multiselect__single:hover {
  border-color: #cfcfcf;
}

.multiselect__input:focus,
.multiselect__single:focus {
  border-color: #a8a8a8;
  outline: none;
}

.multiselect__tags-wrap {
  display: inline;
}

.multiselect__tags {
  min-height: 47px;
  display: block;
  padding: 13px 47px 6px 12px;
  border-radius: 4px;
  background: $secondary;
}

.multiselect__tag {
  position: relative;
  display: inline-block;
  padding: 4px 26px 4px 10px;
  border-radius: 4px;
  margin-right: 6px;
  color: #ffffff;
  line-height: 1;
  background: $primary;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  transition: all 0.2s ease;

  &:focus,
  &:hover {
    opacity: 0.7;
  }
}

.multiselect__tag-icon {
  cursor: pointer;
  margin-left: 7px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-style: initial;
  width: 22px;
  text-align: center;
  line-height: 22px;
  transition: all 0.2s ease;
  border-radius: 4px;

  &:after {
    content: "×";
    color: #ffffff;
    font-size: 14px;
  }
}

.multiselect__current {
  line-height: 16px;
  min-height: 40px;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  padding: 8px 12px 0;
  padding-right: 30px;
  white-space: nowrap;
  margin: 0;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
}

.multiselect__select {
  line-height: 16px;
  display: block;
  position: absolute;
  box-sizing: border-box;
  width: 40px;
  height: 45px;
  right: 1px;
  top: 1px;
  padding: 4px 8px;
  margin: 0;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:before {
    position: relative;
    right: 0;
    top: 65%;
    color: #ffffff;
    margin-top: 4px;
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: #ffffff transparent transparent transparent;
    content: "";
  }
}

.multiselect__placeholder {
  color: #adadad;
  display: inline-block;
  margin-bottom: 10px;
  padding-top: 2px;
}

.multiselect--active .multiselect__placeholder {
  display: none;
}

.multiselect__content-wrapper {
  position: absolute;
  display: block;
  background: $secondary;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 50;
  -webkit-overflow-scrolling: touch;
}

.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}

.multiselect--above .multiselect__content-wrapper {
  bottom: 100%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: none;
  border-top: 1px solid #e8e8e8;
}

.multiselect__content::webkit-scrollbar {
  display: none;
}

.multiselect__element {
  display: block;
}

.multiselect__option {
  display: block;
  padding: 12px;
  min-height: 40px;
  line-height: 16px;
  text-decoration: none;
  text-transform: none;
  position: relative;
  cursor: pointer;
  white-space: nowrap;

  &:after {
    top: 0;
    right: 0;
    position: absolute;
    line-height: 40px;
    padding-right: 12px;
    padding-left: 20px;
  }
}

.multiselect__option--highlight {
  background: $primary;
  outline: none;
  color: #ffffff;

  &:after {
    content: attr(data-select);
    font-size: 10px;
    background: $primary;
    color: #ffffff;
  }
}

.multiselect__option--selected {
  background: #f3f3f3;
  color: $secondary;

  &:after {
    content: attr(data-selected);
    font-size: 10px;
    color: silver;
  }

  &.multiselect__option--highlight {
    background: #f35137;
    color: #ffffff;

    &:after {
      background: #f35137;
      content: attr(data-deselect);
      color: #ffffff;
    }
  }
}

.multiselect-enter-active,
.multiselect-leave-active {
  transition: all 0.15s ease;
}

.multiselect-enter,
.multiselect-leave-active {
  opacity: 0;
}

.multiselect__strong {
  margin-bottom: 10px;
  display: inline-block;
}

*[dir="rtl"] {
  .multiselect {
    text-align: right;
  }

  .multiselect__select {
    right: auto;
    left: 1px;
  }

  .multiselect__tags {
    padding: 8px 8px 0px 40px;
  }

  .multiselect__content {
    text-align: right;
  }

  .multiselect__option:after {
    right: auto;
    left: 0;
  }

  .multiselect__clear {
    right: auto;
    left: 12px;
  }

  .multiselect__spinner {
    right: auto;
    left: 1px;
  }
}

@keyframes spinning {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(2turn);
  }
}
</style>
