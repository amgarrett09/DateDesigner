<template>
  <!-- Displayed when user hits 'save' on the itinerary page. -->
  <div class="modal-wrapper">
    <article class="save-modal">
      <div v-show="!saved && error.length === 0" style="text-align:center">
        <p>Saving...</p>
      </div>
      <div v-show="saved" style="text-align:center">
        <p><strong>Saved!</strong></p>
        <div class="save-modal__buttons">
          <link-button :to="shareLink" text="Review and Share" />
        </div>
      </div>
      <div v-show="error.length > 0" style="text-align:center">
        <p>{{ error }}</p>
        <div class="save-modal__buttons">
          <button
            type="button"
            class="save-modal__error-button save-modal__error-button--retry"
            @click.prevent="retry"
          >
            Retry
          </button>
          <button
            type="button"
            class="save-modal__error-button save-modal__error-button--cancel"
            @click.prevent="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import LinkButton from '../buttons/LinkButton.vue'
export default {
  components: {
    LinkButton
  },
  props: {
    saved: {
      type: Boolean,
      required: true
    },
    error: {
      type: String,
      required: false,
      default: ''
    },
    shareLink: {
      type: String,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    retry() {
      this.$emit('retry')
    }
  }
}
</script>

<style scoped>
.save-modal {
  position: relative;
  background-color: white;
  width: 85%;
  top: -20%;
  border-radius: 5px;
  padding: 10px 0px 10px 0px;
  min-height: 120px;
}
.save-modal__buttons {
  display: flex;
  justify-content: center;
}
.save-modal__error-button {
  margin-left: 10px;
  margin-right: 10px;
  background: transparent;
  font-weight: bold;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.save-modal__error-button--retry {
  border: 3px solid green;
}
.save-modal__error-button--cancel {
  border: 3px solid red;
}
</style>
