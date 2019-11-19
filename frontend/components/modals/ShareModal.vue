<template>
  <!-- Displays a link so that users can share their saved schedules. -->
  <div class="modal-wrapper" @click="closeModal">
    <article class="share-modal" @click.stop>
      <h2 class="share-modal__title">
        Copy the link and send it to your date!
      </h2>
      <textarea v-model="shareLink" class="share-modal__textarea" readonly />
      <button class="share-modal__copy-button" type="button" @click="copyLink">
        Copy to Clipboard
      </button>
    </article>
  </div>
</template>

<script>
import { frontendBaseURL } from '../../config-variables.js'
export default {
  props: {
    hash: {
      type: String,
      required: true
    }
  },
  computed: {
    shareLink() {
      return `${frontendBaseURL}/schedule/${this.hash}`
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    async copyLink() {
      const result = await navigator.permissions.query({
        name: 'clipboard-write'
      })

      if (result.state === 'granted' || result.state === 'prompt') {
        await navigator.clipboard.writeText(this.shareLink)
      }
    }
  }
}
</script>

<style scoped>
.share-modal {
  position: relative;
  min-height: 200px;
  width: 85%;
  background-color: #5ab9f8;
  border-radius: 5px;
  top: -20%;
}
.share-modal__textarea {
  display: block;
  margin: 0 auto;
  width: 80%;
  min-height: 70px;
}
.share-modal__title {
  text-align: center;
}
.share-modal__copy-button {
  display: block;
  margin: 20px auto 20px auto;
}
</style>
