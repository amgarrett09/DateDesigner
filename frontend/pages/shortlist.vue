<template>
  <!-- A list of all the locations the user has saved so far. -->
  <div class="shortlist">
    <nav-bar page="shortlist" />
    <main class="shortlist__main">
      <div v-if="items.length > 0">
        <div class="title-block title-block--green">
          <h1>Review choices</h1>
          <p>
            If these look fun, you'll make a schedule next.
          </p>
        </div>
        <div class="container">
          <section class="shortlist__places">
            <place-card
              v-for="item in items"
              :key="item.id"
              :place="item"
              class="shortlist__place-card"
            />
            <div style="text-align:center">
              <p>
                <nuxt-link to="/itinerary"
                  >Looks good, let's make a schedule!</nuxt-link
                >
              </p>
              <p>or</p>
              <p>
                <nuxt-link :to="backUrl">Go back to full list</nuxt-link>
              </p>
            </div>
          </section>
        </div>
      </div>
      <div v-else class="shortlist__places shortlist__places--empty">
        <h1 style="margin:0;text-align:center">Select some options!</h1>
      </div>
    </main>
    <page-footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlaceCard from '../components/PlaceCard.vue'
import NavBar from '../components/NavBar'
import PageFooter from '../components/PageFooter.vue'
export default {
  components: {
    PlaceCard,
    NavBar,
    PageFooter
  },
  computed: {
    backUrl() {
      return `/location/${this.lastSearch}`
    },
    ...mapState('shortlist', ['items', 'lastSearch'])
  },
  head() {
    return {
      title: 'Review choices'
    }
  }
}
</script>

<style scoped>
.shortlist {
  background-color: #313131;
}
.shortlist__main {
  padding-top: 64px;
}
.shortlist__places {
  background-color: #f4f3f2;
  width: 85%;
  min-height: 70vh;
}
.shortlist__place-card {
  width: 70%;
  margin: 20px auto;
}
.shortlist a {
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: blue;
}
.shortlist a:hover {
  text-decoration: underline;
}
.title-block--green {
  background-color: #24cf60;
}
.shortlist h1 {
  margin: 0;
}
.shortlist__places--empty {
  min-height: 86vh;
}
@media (max-width: 600px) {
  .shortlist__main {
    width: 100%;
  }
  .shortlist__places {
    width: 100%;
  }
  .shortlist__place-card {
    width: 85%;
  }
  .shortlist a {
    font-size: 1.6rem;
  }
}
</style>
