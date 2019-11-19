<template>
  <!-- Allows user to report whether a place has
  gender-neutral bathrooms or is wheelchair accessible. -->
  <div class="modal-wrapper" @click="closeModal">
    <article class="report-modal" @click.stop>
      <h1 v-if="typeIsGNB" style="text-align:center">
        Does '{{ place.name }}' have gender neutral bathrooms?
      </h1>
      <h1 v-if="typeIsWCA" style="text-align:center">
        Is '{{ place.name }}' wheelchair accessible?
      </h1>
      <section style="height:75px">
        <div v-show="!submitted" class="vote-buttons">
          <button
            class="vote-buttons__yes-button"
            type="button"
            @click.prevent="reportYes"
          >
            Yes
          </button>
          <button
            class="vote-buttons__no-button"
            type="button"
            @click.prevent="reportNo"
          >
            No
          </button>
        </div>
        <div v-show="submitted && !loaded" style="text-align:center">
          <strong>Submitting...</strong>
        </div>
        <div v-show="submitted && loaded" style="text-align: center">
          {{ notice }}
        </div>
      </section>
      <br />
      <div style="text-align:center">
        <button
          class="report-modal__close-button"
          type="button"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </article>
  </div>
</template>

<script>
import { apiBaseURL } from '../../config-variables.js'
export default {
  props: {
    place: {
      type: Object,
      required: true
    },
    reportType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      submitted: false,
      loaded: false,
      notice: ''
    }
  },
  computed: {
    typeIsGNB() {
      return this.reportType === 'GNB'
    },
    typeIsWCA() {
      return this.reportType === 'WCA'
    }
  },
  methods: {
    closeModal() {
      this.submitted = false
      this.loaded = false
      this.$emit('close')
    },
    async reportYes() {
      this.submitted = true

      try {
        if (this.typeIsGNB) {
          const { results } = await this.$axios.$patch(
            `${apiBaseURL}/api/v1/places/${this.place.id}`,
            {
              op: 'add',
              field: 'has_gnb'
            }
          )
          this.notice = 'Report submitted! Thank you!'
          this.$emit('refresh', results)
        } else if (this.typeIsWCA) {
          const { results } = await this.$axios.$patch(
            `${apiBaseURL}/api/v1/places/${this.place.id}`,
            {
              op: 'add',
              field: 'is_wheelchair_accessible'
            }
          )
          this.notice = 'Report submitted! Thank you!'
          this.$emit('refresh', results)
        }
      } catch (err) {
        this.notice = err.message
      }

      this.loaded = true
    },
    async reportNo() {
      this.submitted = true

      try {
        if (this.typeIsGNB) {
          const { results } = await this.$axios.$patch(
            `${apiBaseURL}/api/v1/places/${this.place.id}`,
            {
              op: 'add',
              field: 'has_no_gnb'
            }
          )

          this.notice = 'Report submitted! Thank you!'
          this.$emit('refresh', results)
        } else if (this.typeIsWCA) {
          const { results } = await this.$axios.$patch(
            `${apiBaseURL}/api/v1/places/${this.place.id}`,
            {
              op: 'add',
              field: 'is_not_wheelchair_accessible'
            }
          )

          this.notice = 'Report submitted! Thank you!'
          this.$emit('refresh', results)
        }
      } catch (err) {
        this.notice = 'There was a network problem. Please try again later.'
      }
      this.loaded = true
    }
  }
}
</script>

<style scoped>
.report-modal {
  position: relative;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  width: 80%;
  top: -20%;
}
.vote-buttons {
  display: flex;
  justify-content: center;
}
.vote-buttons__yes-button {
  margin: 0px 20px 0px 20px;
  background: transparent;
  border: 3px solid #23d160;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1rem;
  padding: 5px 10px 5px 10px;
  cursor: pointer;
}
.vote-buttons__no-button {
  margin: 0px 20px 0px 20px;
  background: transparent;
  border: 3px solid red;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1rem;
  padding: 5px 10px 5px 10px;
  cursor: pointer;
}
.report-modal__close-button {
  background: transparent;
  border: none;
  font-weight: bold;
  text-decoration: underline;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
