<template>
  <div class="index">
    <div class="index__container" style="text-align:center">
      <h1 class="title">Date Designer</h1>
      <h2 class="subtitle">A date planning app for you and your sweeite(s)</h2>
      <div class="autocomplete">
        <label>
          <span class="autocomplete__label-text">Enter a city:</span>
          <autocomplete :search="search" auto-select @submit="onSubmit" />
        </label>
      </div>
    </div>
    <page-footer />
  </div>
</template>

<script>
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import PageFooter from '../components/PageFooter.vue'
import { apiBaseURL } from '../config-variables.js'
export default {
  components: {
    PageFooter,
    Autocomplete
  },
  data() {
    return {
      value: '',
      items: [],
      errors: []
    }
  },
  head() {
    return {
      title: 'Home',
      meta: [
        {
          name: 'og:title',
          property: 'og:title',
          content: 'Home - Date Designer'
        }
      ]
    }
  },
  methods: {
    async search(value) {
      if (value.length < 3) return []

      try {
        const { results } = await this.$axios.$get(
          `${apiBaseURL}/api/v1/cities/autocomplete/${value}`
        )
        return results
      } catch (err) {
        return []
      }
    },
    onSubmit(cityName) {
      const encoded = encodeURIComponent(cityName)
      this.$router.push(`/location/${encoded}`)
    }
  }
}
</script>

<style scoped>
.index {
  background-color: #2273ad;
  color: white;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 70px;
  color: white;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 30px;
  color: white;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.index__container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.autocomplete {
  color: black;
}
.autocomplete__label-text {
  color: white;
  font-size: 1.3rem;
}
</style>
