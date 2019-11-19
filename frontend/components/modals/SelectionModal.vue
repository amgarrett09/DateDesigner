<template>
  <!-- Displays a list of choices that the user can
  put in a slot on the itinerary page. -->
  <div class="modal-wrapper" @click="closeModal">
    <div class="selection-modal" @click.stop>
      <choice-button
        v-for="item in items"
        :key="item.id"
        :item="item"
        @select-item="selectItem"
      />
    </div>
  </div>
</template>

<script>
import ChoiceButton from '../buttons/ChoiceButton.vue'
export default {
  components: {
    ChoiceButton
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    types() {
      return this.items.map(item => item.types.split(',')[0])
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    selectItem(id) {
      this.$emit('select-item', id)
    }
  }
}
</script>

<style scoped>
.selection-modal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: -20%;
  padding: 10px 20px 10px 20px;
  border-radius: 5px;
  width: 83%;
  background-color: white;
}
</style>
