<template>
  <!-- Used in the selection modal to display choices
  which can be clicked on. -->
  <button type="button" class="choice-button" @click.prevent="onClick">
    <span>{{ item.name }}</span>
    <span>{{ type }}</span>
  </button>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      return this.item.types.split(',')[0]
    }
  },
  methods: {
    onClick() {
      this.$emit('select-item', this.item.id)
    }
  }
}
</script>

<style scoped>
.choice-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2273ad;
  color: white;
  border: none;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 1.3rem;
  width: 90%;
  margin-bottom: 20px;
  height: 50px;
  cursor: pointer;
}
</style>
