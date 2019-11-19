<template>
  <nav class="navbar">
    <div class="navbar__logo"><nuxt-link to="/">Date Designer</nuxt-link></div>
    <div>
      <span v-if="page === 'shortlist' || page === 'itinerary'">
        <nuxt-link class="navbar__link" :to="`/location/${lastSearch}`"
          >Back to Browsing</nuxt-link
        >
      </span>
      <span
        v-if="itemsLength > 0 && (page === 'location' || page === 'itinerary')"
      >
        <nuxt-link class="navbar__link" to="/shortlist"
          >Shortlist ({{ itemsLength }})</nuxt-link
        >
      </span>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    page: {
      type: String,
      required: true
    }
  },
  computed: {
    itemsLength() {
      return this.$store.state.shortlist.items.length
    },
    ...mapState('shortlist', ['lastSearch'])
  }
}
</script>

<style scoped>
.navbar {
  height: 64px;
  width: 100%;
  position: fixed;
  top: 0;
  background-color: #14476b;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.navbar__logo {
  font-size: 1.5rem;
  margin-left: 20px;
}
.navbar__logo a {
  color: white;
  text-decoration: none;
}
.navbar__link {
  color: white;
  margin-right: 20px;
}
@media (max-width: 600px) {
  .navbar__link {
    margin-right: 10px;
  }
  .navbar__logo {
    font-size: 1.3rem;
    margin-left: 10px;
    width: 100px;
    text-align: center;
  }
}
</style>
