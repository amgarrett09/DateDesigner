<template>
  <!-- Pass an array of titles (tab names) as props, and then
  this generates a tab button and a named slot for each title. -->
  <article class="tabs">
    <div class="tabs__nav">
      <button
        v-for="(title, i) in titles"
        :key="title + i"
        type="button"
        class="tabs__button"
        :class="{
          'tabs__button--active': activeTitle === title,
          'tabs__button--normal': activeTitle !== title
        }"
        @click="setActiveTitle"
      >
        {{ title }}
      </button>
    </div>
    <section class="tabs__content">
      <div
        v-for="title in titles"
        v-show="activeTitle === title"
        :key="title"
        class="slot"
      >
        <slot :name="title"></slot>
      </div>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    titles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // The name of the tab that the user has clicked on
      activeTitle: ''
    }
  },
  created() {
    if (this.titles.length > 0) {
      this.activeTitle = this.titles[0]
    }
  },
  methods: {
    setActiveTitle(e) {
      this.activeTitle = e.target.innerText
    }
  }
}
</script>

<style scoped>
.tabs__button {
  font-size: 18px;
  padding: 10px;
  width: 150px;
  border: 0;
  background: #dddddd;
}
.tabs__button--normal:hover {
  background: #f7f4f4;
}
.tabs__button--active {
  background: #1eb854;
  font-weight: bold;
}
.tabs__nav {
  background-color: #dddddd;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.tabs__content {
  display: flex;
  justify-content: center;
}
.slot {
  width: 70%;
}
@media (max-width: 600px) {
  .slot {
    width: 90%;
  }
  .tabs__button {
    width: 120px;
  }
}
@media (min-width: 1100px) {
  .slot {
    width: 50%;
  }
}
</style>
