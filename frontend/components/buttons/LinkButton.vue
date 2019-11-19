<template>
  <div>
    <a v-if="external" style="text-decoration:none" :href="to" :target="target">
      <div class="link-button">
        {{ text }}
      </div>
    </a>
    <nuxt-link v-else style="text-decoration:none" :to="to">
      <div class="link-button">
        {{ text }}
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: false,
      default: ''
    },
    external: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    onClick() {
      this.$emit('display-info')
    }
  }
}
</script>

<style scoped>
.link-button {
  font-weight: bold;
  color: black;
  border: 3px solid #2273ad;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 44px;
  width: 150px;
  border-radius: 5px;
}
</style>
