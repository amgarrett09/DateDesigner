<template>
  <!-- Allows the user to put locations in their shorlist into
  time slots and build a schedule. When the user saves, the schedule
  is stored in a DB and we get a hash back which will allow us to view
  the saved schedule on the schedule.vue page -->
  <div class="itinerary">
    <nav-bar page="itinerary" />
    <main class="itinerary__main">
      <div class="title-block title-block--purple">
        <h1>Create a schedule</h1>
        <p>Click a time slot to schedule a date location.</p>
      </div>
      <section class="itinerary__schedule">
        <schedule @save-schedule="saveSchedule" />
      </section>
    </main>
    <save-modal
      v-show="showModal"
      :saved="saved"
      :error="saveError"
      :share-link="shareLink"
      @retry="saveSchedule"
      @close="closeModal"
    />
    <page-footer />
  </div>
</template>

<script>
import { apiBaseURL } from '../config-variables.js'
import Schedule from '../components/Schedule'
import SaveModal from '../components/modals/SaveModal.vue'
import NavBar from '../components/NavBar.vue'
import PageFooter from '../components/PageFooter.vue'
export default {
  components: {
    Schedule,
    SaveModal,
    NavBar,
    PageFooter
  },
  data() {
    return {
      showModal: false,
      saved: false,
      saveError: '',
      hash: '', // The hash that the schedule-saving endpoint responds with
      payload: {} // Payload to submit to saving enpoint if we have to retry
    }
  },
  head() {
    return {
      title: 'Create a schedule',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Build a schedule by placing your selected locations into time slots. Then save and share.'
        },
        {
          name: 'og:title',
          property: 'og:title',
          content: 'Create a schedule - Date Designer'
        },
        {
          name: 'og:description',
          property: 'og:description',
          content:
            'Build a schedule by placing your selected locations into time slots. Then save and share.'
        }
      ]
    }
  },
  computed: {
    shareLink() {
      return `/schedule/${this.hash}`
    }
  },
  methods: {
    async saveSchedule(payload = this.payload) {
      /* Cache the payload we get from the save schedule event in
      case we need to retry */
      this.payload = payload

      this.showModal = true
      try {
        const { results } = await this.$axios.$post(
          `${apiBaseURL}/api/v1/schedules`,
          payload
        )
        this.saved = true
        this.hash = results[0].hash
        this.saveError = ''
      } catch (err) {
        this.saveError = err.message
      }
    },
    closeModal() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.itinerary {
  background-color: #313131;
}
.itinerary__main {
  padding-top: 64px;
}
.itinerary__schedule {
  margin: 0 auto;
  width: 85%;
  background-color: #f4f3f2;
}
.title-block--purple {
  background-color: #6b1447;
  color: white;
}
.itinerary h1 {
  margin: 0;
}
@media (max-width: 600px) {
  .itinerary__schedule {
    width: 100%;
  }
  .itinerary__headline {
    width: 100%;
  }
}
</style>
