<template>
  <!-- To be used on the page which displays saved schedules (schedule.vue). Displays
the time and some basic info about the location. -->
  <article class="schedule-item">
    <div class="schedule-item__headline">
      <h2>{{ time }}</h2>
    </div>
    <div class="schedule-item__content">
      <p>{{ place.name }}</p>
      <p>{{ type }}</p>
      <p>{{ place.address }}</p>
      <p v-if="place.has_gnb > place.has_no_gnb">
        ✔️ Has gender neutral bathrooms!
      </p>
      <p
        v-if="
          place.is_wheelchair_accessible > place.is_not_wheelchair_accessible
        "
      >
        ✔️ Is wheelchair accessible!
      </p>
      <p v-if="place.types.includes('food')">
        ✔️ Has food
      </p>
      <link-button
        text="Open in Maps"
        :to="generateMapsLink(place.name, place.address)"
        :external="true"
        target="_blank"
      />
    </div>
  </article>
</template>

<script>
import LinkButton from './buttons/LinkButton.vue'
export default {
  components: {
    LinkButton
  },
  props: {
    time: {
      type: String,
      required: true
    },
    place: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      return this.place.types.split(',')[0]
    }
  },
  methods: {
    generateMapsLink(name, address) {
      const query = `${name} ${address}`.replace(' ', '+')
      return `https://www.google.com/maps/search/${query}`
    }
  }
}
</script>

<style scoped>
.schedule-item {
  min-height: 100px;
  width: 85%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  padding-top: 0;
  background-color: white;
}
.schedule-item__headline {
  background-color: #2273ad;
  color: white;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.schedule-item h2 {
  margin: 0;
}
.schedule-item__content {
  padding: 10px 20px 10px 20px;
}
</style>
