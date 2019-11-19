<template>
  <button type="button" class="info-button" @click="onClick">{{ text }}</button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  methods: {
    onClick() {
      this.$emit('click-info')
    }
  }
}
</script>

<style scoped>
.info-button {
  font-size: 1rem;
  font-weight: bold;
  background: #5ab9f8;
  padding: 10px;
  border: none;
  border-radius: 5px;
}
</style>
