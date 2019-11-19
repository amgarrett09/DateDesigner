<template>
  <div class="schedule">
    <schedule-cell
      v-for="(obj, time) in schedule"
      :key="time"
      :time="time"
      :place="obj.place"
      :fill-color="obj.fillColor"
      @add-item="onAddItem"
      @remove-item="onRemoveItem"
    />
    <button
      type="button"
      class="schedule__save-button"
      :aria-disabled="scheduleEmpty"
      :disabled="scheduleEmpty"
      @click="saveSchedule"
    >
      Save
    </button>
    <selection-modal
      v-show="showModal"
      :items="choices"
      @close="closeModal"
      @select-item="selectItem"
    />
  </div>
</template>

<script>
import ScheduleCell from './ScheduleCell.vue'
import SelectionModal from './modals/SelectionModal.vue'
export default {
  components: {
    ScheduleCell,
    SelectionModal
  },
  data() {
    return {
      schedule: {
        '5am': { place: {}, fillColor: 'transparent' },
        '6am': { place: {}, fillColor: 'transparent' },
        '7am': { place: {}, fillColor: 'transparent' },
        '8am': { place: {}, fillColor: 'transparent' },
        '9am': { place: {}, fillColor: 'transparent' },
        '10am': { place: {}, fillColor: 'transparent' },
        '11am': { place: {}, fillColor: 'transparent' },
        '12pm': { place: {}, fillColor: 'transparent' },
        '1pm': { place: {}, fillColor: 'transparent' },
        '2pm': { place: {}, fillColor: 'transparent' },
        '3pm': { place: {}, fillColor: 'transparent' },
        '4pm': { place: {}, fillColor: 'transparent' },
        '5pm': { place: {}, fillColor: 'transparent' },
        '6pm': { place: {}, fillColor: 'transparent' },
        '7pm': { place: {}, fillColor: 'transparent' },
        '8pm': { place: {}, fillColor: 'transparent' },
        '9pm': { place: {}, fillColor: 'transparent' },
        '10pm': { place: {}, fillColor: 'transparent' },
        '11pm': { place: {}, fillColor: 'transparent' }
      },
      choices: [],
      selectedTime: '',
      showModal: false
    }
  },
  computed: {
    scheduleEmpty() {
      let empty = true
      for (const key in this.schedule) {
        if (this.schedule[key].place.id) {
          empty = false
          break
        }
      }

      return empty
    }
  },
  created() {
    this.choices = [...this.$store.state.shortlist.items]
  },
  methods: {
    onAddItem(time) {
      if (this.choices.length > 0) {
        this.showModal = true
        this.selectedTime = time
      }
    },
    onRemoveItem({ time, place }) {
      this.schedule[time].place = {}
      this.choices = this.choices.concat([place])

      // Set fill color for the time slot back to transparent
      this.schedule[time].fillColor = 'transparent'
    },
    closeModal() {
      this.showModal = false
    },
    selectItem(id) {
      const choice = this.choices.filter(item => item.id === id)

      /* If we find a choice with the correct id, 
      map it to the last selected time */
      if (!choice[0]) {
        this.closeModal()
        return
      }

      this.schedule[this.selectedTime].place = choice[0]
      this.setFillColors()

      // Remove the selected choice from the choices list
      this.choices = this.choices.filter(item => item.id !== id)

      this.closeModal()
    },
    setFillColors() {
      let primaryColor = true
      for (const key in this.schedule) {
        // Set alternating fill colors for time slots that have items in them
        if (this.schedule[key].place.id) {
          this.schedule[key].fillColor = primaryColor ? '#2273ad' : '#313131'
          primaryColor = !primaryColor
        }
      }
    },
    saveSchedule() {
      const payload = {
        schedule: {}
      }

      // Put each timeslot that's filled with a place into the payload
      for (const key in this.schedule) {
        if (this.schedule[key].place.id) {
          payload.schedule[key] = this.schedule[key].place
        }
      }

      this.$emit('save-schedule', payload)
    }
  }
}
</script>

<style scoped>
.schedule {
  width: 85%;
  margin: 0 auto;
}
.schedule__save-button {
  margin: 10px 0 10px 0;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px 10px 20px;
  background: #24cf60;
  border-radius: 5px;
  cursor: pointer;
}
.schedule__save-button:disabled {
  background: rgb(231, 231, 231);
}
</style>
