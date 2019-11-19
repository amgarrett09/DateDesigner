<template>
  <!-- A list of points of interest in a given location.
  Users can add locations to a shortlist, and report whether
  locations have gender-neutral bathrooms and/or are
  wheelchair accessible. -->
  <div class="place">
    <nav-bar page="location" />
    <main class="location__main">
      <div class="container">
        <div class="title-block title-block--blue">
          <h1 v-if="results.length > 0">Date ideas in {{ cityName }}</h1>
          <h1 v-else>No ideas found!</h1>
        </div>
        <place-list
          v-if="results.length > 0"
          :place-data="results"
          :loaded="loaded"
        />
        <div v-else class="location__error-report">
          <p>
            No results came back.
          </p>
          <p>
            Make sure you're searching for a valid location, and
            <nuxt-link to="/">try a different search.</nuxt-link>
          </p>
        </div>
      </div>
    </main>
    <page-footer />
  </div>
</template>

<script>
import PlaceList from '../../components/PlaceList.vue'
import NavBar from '../../components/NavBar.vue'
import PageFooter from '../../components/PageFooter.vue'
import { apiBaseURL } from '../../config-variables'

const cityNameRE = /([A-Za-z ]+), [A-Z]{2} [0-9]{5}/
export default {
  components: {
    PlaceList,
    NavBar,
    PageFooter
  },
  data() {
    return {
      loaded: false,
      cityName: '',
      errors: [],
      results: []
    }
  },
  head() {
    return {
      title: `Locations in ${this.cityName}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `See a list of date ideas in ${this.cityName}.`
        },
        {
          name: 'og:title',
          property: 'og:title',
          content: `Locations in ${this.cityName} - Date Designer`
        }
      ]
    }
  },
  computed: {
    zip() {
      return this.$route.params.zip
    }
  },
  async asyncData(context) {
    try {
      const city = context.route.params.city
      const data = await context.$axios.$get(
        `${apiBaseURL}/api/v1/places/byCity/${city}`
      )

      context.store.dispatch('shortlist/setLastSearch', city)

      const cityNameMatches = data.results[0].address.match(cityNameRE)
      const cityName = cityNameMatches[1]

      return {
        results: data.results,
        loaded: true,
        cityName
      }
    } catch (err) {
      return {
        results: [],
        errors: ['There was a network error. Please try again.'],
        loaded: true
      }
    }
  }
}
</script>

<style scoped>
.place {
  background-color: #313131;
  min-height: 100vh;
}
.location__main {
  padding-top: 64px;
}
.location__error-report {
  background-color: #f4f3f2;
  width: 85%;
  height: 73vh;
}
.location__error-report > p {
  text-align: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title-block--blue {
  color: white;
  background-color: #2273ad;
}
@media (max-width: 600px) {
  .place__title-block {
    width: 100%;
  }
  .location__error-report {
    width: 100%;
  }
}
</style>
