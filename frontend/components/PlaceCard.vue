<template>
  <article class="place-card">
    <h2 class="place-card__header">{{ place.name }}</h2>
    <section class="place-card__content">
      <p>
        <strong>{{ type }}</strong>
      </p>
      <p>{{ place.address }}</p>
      <p><strong>Rating</strong>: {{ rating }}</p>
      <p><strong>Price level</strong>: {{ priceLevel }}</p>
      <p style="margin-bottom:1.5rem">
        <strong>Gender neutral restrooms?</strong>
        <span class="place-card__vote">
          <vote-tracker :yes="place.has_gnb" :no="place.has_no_gnb" />
          <button
            class="place-card__report"
            type="button"
            @click.prevent="reportGNB"
          >
            Report
          </button>
        </span>
      </p>
      <p style="margin-bottom:1.5rem">
        <strong>Wheelchair accessible?</strong>
        <span class="place-card__vote">
          <vote-tracker
            :yes="place.is_wheelchair_accessible"
            :no="place.is_not_wheelchair_accessible"
          />
          <button
            class="place-card__report"
            type="button"
            @click.prevent="reportWCA"
          >
            Report
          </button>
        </span>
      </p>
      <div class="place-card__buttons">
        <link-button
          :to="mapsSearch"
          :external="true"
          target="_blank"
          text="Open in Maps"
        />
        <toggle-button
          :active="added"
          active-text="Added!"
          normal-text="Add to shortlist"
          @toggle="addToShortlist"
        />
      </div>
    </section>
  </article>
</template>

<script>
import VoteTracker from './VoteTracker.vue'
import ToggleButton from './buttons/ToggleButton.vue'
import LinkButton from './buttons/LinkButton.vue'
export default {
  components: {
    VoteTracker,
    ToggleButton,
    LinkButton
  },
  props: {
    place: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      return this.place.types.split(',')[0]
    },
    priceLevel() {
      return this.place.price_level === -1 ? '?' : this.place.price_level
    },
    rating() {
      return this.place.google_user_rating === -1
        ? '?'
        : this.place.google_user_rating
    },
    added() {
      // Returns true if this place is in the Vuex store
      return !!this.$store.state.shortlist.addedIDs[this.place.id.toString()]
    },
    mapsSearch() {
      const query = `${this.place.name} ${this.place.address}`.replace(' ', '+')
      return `https://www.google.com/maps/search/${query}`
    }
  },
  methods: {
    addToShortlist() {
      if (!this.added) {
        this.$store.dispatch('shortlist/add', this.place)
      } else {
        this.$store.dispatch('shortlist/remove', this.place)
      }
    },
    reportGNB() {
      this.$emit('report', {
        type: 'GNB',
        place: this.place
      })
    },
    reportWCA() {
      this.$emit('report', {
        type: 'WCA',
        place: this.place
      })
    }
  }
}
</script>

<style scoped>
.place-card {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin: 10px 0px 20px 0px;
  padding: 0;
}
.place-card__header {
  background-color: #2273ad;
  color: white;
  margin: 0;
  padding: 20px;
}
.place-card__content {
  padding: 0 30px 10px 30px;
}
.place-card__buttons {
  display: flex;
  justify-content: flex-end;
}
.place-card__report {
  margin-left: 20px;
  border: 2px solid blue;
  border-radius: 5px;
  background: transparent;
  font-weight: bold;
  cursor: pointer;
}
.place-card__vote {
  display: inline-flex;
  align-items: center;
}
</style>
