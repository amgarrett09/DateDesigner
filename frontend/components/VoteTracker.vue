<template>
  <!-- Displays a red/green bar to display a relative number
  of yes and no votes -->
  <span :style="voteStyle">{{ text }}</span>
</template>

<script>
export default {
  props: {
    yes: {
      type: Number,
      required: true
    },
    no: {
      type: Number,
      required: true
    }
  },
  computed: {
    yesPct() {
      if (this.yes === 0 && this.no === 0) {
        return 0
      }

      return Math.floor((this.yes / (this.yes + this.no)) * 100)
    },
    noPct() {
      if (this.yes === 0 && this.no === 0) {
        return 0
      }

      return 100 - this.yesPct
    },
    text() {
      if (this.yes > this.no && this.yes > 0) {
        return `Yes: ${this.yesPct}%`
      } else if (this.yes <= this.no && this.no > 0) {
        return `No: ${this.noPct}%`
      }

      return 'Unknown'
    },
    voteStyle() {
      let gradient
      let color
      let unknown
      if (this.yes > this.no && this.yes > 0) {
        gradient = `linear-gradient(90deg, #20c95b \
          ${this.yesPct}%, #c12424 ${this.noPct}%)`

        color = 'black'
      } else if (this.yes <= this.no && this.no > 0) {
        gradient = `linear-gradient(90deg, #c12424 \
          ${this.noPct}%, #20c95b ${this.yesPct}%)`

        color = 'white'
      } else {
        gradient = '#545454'
        color = 'white'
        unknown = true
      }

      return {
        textAlign: unknown ? 'center' : 'left',
        color,
        fontWeight: 'bold',
        display: 'inline-block',
        width: '150px',
        background: gradient,
        borderRadius: '20px',
        padding: '0px 10px 0px 10px'
      }
    }
  }
}
</script>

<style></style>
