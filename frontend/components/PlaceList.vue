<template>
  <!-- A list of places, separated by tabs into a handful of categories. -->
  <section class="place-list">
    <div>
      <tabs :titles="titles">
        <div v-if="cafes.length > 0" slot="Cafes">
          <place-card
            v-for="cafe in cafes"
            :key="cafe"
            :place="resultsMap[cafe]"
            @report="openReportModal"
          />
        </div>
        <div v-if="parks.length > 0" slot="Parks">
          <place-card
            v-for="park in parks"
            :key="park"
            :place="resultsMap[park]"
            @report="openReportModal"
          />
        </div>
        <div v-if="museums.length > 0" slot="Museums">
          <place-card
            v-for="mus in museums"
            :key="mus"
            :place="resultsMap[mus]"
            @report="openReportModal"
          />
        </div>
        <div v-if="restaurants.length > 0" slot="Restaurants">
          <place-card
            v-for="res in restaurants"
            :key="res"
            :place="resultsMap[res]"
            @report="openReportModal"
          />
        </div>
        <div v-if="bars.length > 0" slot="Bars">
          <place-card
            v-for="bar in bars"
            :key="bar"
            :place="resultsMap[bar]"
            @report="openReportModal"
          />
        </div>
      </tabs>
    </div>
    <report-modal
      v-show="showReportModal"
      :report-type="reportType"
      :place="reportPlace"
      @close="closeReportModal"
      @refresh="refreshCard"
    />
  </section>
</template>

<script>
import Tabs from './Tabs.vue'
import PlaceCard from './PlaceCard.vue'
import ReportModal from './modals/ReportModal.vue'
export default {
  components: {
    Tabs,
    PlaceCard,
    ReportModal
  },
  props: {
    placeData: {
      type: Array,
      required: true
    },
    loaded: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // Data that gets passed to the report modal
      reportType: '',
      reportPlace: {},
      showReportModal: false,
      errors: []
    }
  },
  computed: {
    // A map of each place to its id so we can lookup places quickly later
    resultsMap() {
      const out = {}
      this.placeData.forEach(result => {
        out[result.id.toString()] = result
      })

      return out
    },
    /* Arrays of ids for each category, used to reference places in
    resultsMap */
    cafes() {
      return this.placeData
        .filter(obj => obj.types.includes('cafe'))
        .map(obj => obj.id)
    },
    parks() {
      return this.placeData
        .filter(obj => obj.types.includes('park'))
        .map(obj => obj.id)
    },
    museums() {
      return this.placeData
        .filter(obj => obj.types.includes('museum'))
        .map(obj => obj.id)
    },
    restaurants() {
      return this.placeData
        .filter(obj => obj.types.includes('restaurant'))
        .map(obj => obj.id)
    },
    bars() {
      return this.placeData
        .filter(obj => obj.types.includes('bar'))
        .map(obj => obj.id)
    },
    // Titles for each tab
    titles() {
      const titles = []
      if (this.cafes.length > 0) titles.push('Cafes')
      if (this.parks.length > 0) titles.push('Parks')
      if (this.museums.length > 0) titles.push('Museums')
      if (this.restaurants.length > 0) titles.push('Restaurants')
      if (this.bars.length > 0) titles.push('Bars')

      return titles
    }
  },
  methods: {
    openReportModal({ type, place }) {
      this.reportType = type
      this.reportPlace = place
      this.showReportModal = true
    },
    closeReportModal() {
      this.showReportModal = false
      this.reportType = ''
      this.reportPlace = {}
    },
    refreshCard(results) {
      if (results.length > 0) {
        const id = results[0].id
        this.resultsMap[id.toString()] = results[0]
      }
    }
  }
}
</script>

<style scoped>
.place-list {
  width: 85%;
  min-height: 100vh;
  background-color: #f4f3f2;
  color: black;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
}
@media (max-width: 600px) {
  .place-list {
    width: 100%;
  }
}
</style>
