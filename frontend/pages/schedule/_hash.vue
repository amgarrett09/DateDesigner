<template>
  <!-- Displays a schedule that's been saved in the database.
  The hash in the route params is a unique hash that each saved
  schedule has, and it's used in the request to the API. -->
  <div class="saved-schedule">
    <nav-bar page="share-page" />
    <main class="container saved-schedule__main">
      <div class="title-block title-block--white">
        <h1>Here's the date you planned!</h1>
        <p>
          We'll keep it saved for a week, so you can share the link with your
          partner
        </p>
      </div>
      <section class="schedule-items">
        <schedule-item
          v-for="(place, time) in schedule"
          :key="time"
          :place="place"
          :time="time"
        />
        <div v-if="notFound">
          <p>Schedule not found.</p>
        </div>
        <div v-if="error.length > 0">
          <p>{{ error }}</p>
        </div>
        <info-button text="Share Link" @click-info="openModal" />
      </section>
    </main>
    <share-modal
      v-show="showModal"
      :hash="$route.params.hash"
      @close="closeModal"
    />
    <page-footer />
  </div>
</template>

<script>
import ScheduleItem from '../../components/ScheduleItem.vue'
import InfoButton from '../../components/buttons/InfoButton.vue'
import ShareModal from '../../components/modals/ShareModal.vue'
import NavBar from '../../components/NavBar.vue'
import PageFooter from '../../components/PageFooter.vue'
import { apiBaseURL } from '../../config-variables'
export default {
  components: {
    ScheduleItem,
    InfoButton,
    ShareModal,
    NavBar,
    PageFooter
  },
  data() {
    return {
      notFound: false,
      error: '',
      schedule: {},
      showModal: false
    }
  },
  head() {
    return {
      title: 'Share your schedule',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Share a saved date plan with your partner!'
        },
        {
          name: 'og:title',
          property: 'og:title',
          content: 'Share your schedule - Date Designer'
        },
        {
          name: 'og:description',
          property: 'og:description',
          content: 'Share a saved date plan with your partner!'
        }
      ]
    }
  },
  computed: {
    hash() {
      return this.$route.params.hash
    }
  },
  async asyncData({ $axios, route }) {
    try {
      const hash = route.params.hash
      const { results } = await $axios.$get(
        `${apiBaseURL}/api/v1/schedules/${hash}`
      )

      return {
        schedule: results[0]
      }
    } catch (err) {
      if (err.message.includes('404')) {
        return {
          notFound: true
        }
      }

      return {
        error: 'There was a network error. Please try again.'
      }
    }
  },
  methods: {
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.title-block--white {
  background-color: white;
}
h1 {
  margin: 0;
}
.saved-schedule {
  background-color: #313131;
}
.schedule-items {
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  min-height: 72vh;
  background-color: #f4f3f2;
}
.saved-schedule__main {
  padding-top: 64px;
}
@media (max-width: 600px) {
  .schedule-items {
    width: 100%;
  }
  .title-block--white {
    font-size: 0.9rem;
  }
  h1 {
    font-size: 1.5rem;
  }
}
</style>
