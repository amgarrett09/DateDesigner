<template>
  <!-- Search bar for a zip code, with an input mask. -->
  <form action="">
    <label class="zip-search__label" for="zipcode">
      Enter your Zipcode:
      <br />
      <the-mask v-model="zipcode" :mask="['#####']" />
    </label>
    <input type="submit" value="Submit" @click.prevent="onSubmit" />
  </form>
</template>

<script>
import { TheMask } from 'vue-the-mask'
export default {
  components: {
    TheMask
  },
  data() {
    return {
      zipcode: ''
    }
  },
  methods: {
    onSubmit() {
      // Make sure input is a 5-digit zip code
      const validator = /[0-9]{5}/g
      if (
        !this.zipcode.match(validator) ||
        this.zipcode.match(validator)[0] !== this.zipcode
      ) {
        this.$emit('submit-error')
        return
      }

      this.$emit('submit-zip', this.zipcode)
    }
  }
}
</script>

<style scoped>
.zip-search__label {
  font-size: 20px;
}
</style>
