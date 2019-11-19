<template>
  <!-- A cell representing a time slot. User can click to fill it with a place -->
  <div
    class="schedule-cell"
    :class="{ 'schedule-cell--filled': isFilled }"
    :style="`background-color:${fillColor}`"
    @click="onClick"
  >
    <span>{{ time }}</span>
    <span v-if="place.id" class="schedule-cell__title">{{ place.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: String,
      required: true
    },
    place: {
      type: Object,
      required: true
    },
    fillColor: {
      type: String,
      required: true
    }
  },
  computed: {
    isFilled() {
      return !!this.place.id
    }
  },
  methods: {
    onClick() {
      if (!this.isFilled) {
        this.$emit('add-item', this.time)
      } else {
        this.$emit('remove-item', {
          time: this.time,
          place: this.place
        })
      }
    }
  }
}
</script>

<style scoped>
.schedule-cell {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #636262;
  cursor: pointer;
}
.schedule-cell__title {
  margin-left: 20px;
}
.schedule-cell--filled {
  color: white;
}
</style>
