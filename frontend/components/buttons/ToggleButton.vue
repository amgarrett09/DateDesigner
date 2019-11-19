<template>
  <button
    class="toggle-button"
    :class="buttonClass"
    type="button"
    @click.prevent="onClick"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    activeText: {
      type: String,
      required: true
    },
    normalText: {
      type: String,
      required: true
    }
  },
  computed: {
    text() {
      return this.active ? `✔️ ${this.activeText}` : this.normalText
    },
    buttonClass() {
      return {
        'toggle-button--active': this.active
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('toggle')
    }
  }
}
</script>

<style scoped>
.toggle-button {
  font-size: 1rem;
  font-weight: bold;
  background: transparent;
  border: 3px solid #1eb854;
  border-radius: 5px;
  width: 150px;
  height: 50px;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
}
.toggle-button--active {
  color: black;
  background: #23d160;
  border: 3px solid #23d160;
}
</style>
