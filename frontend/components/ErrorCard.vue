<template>
  <div class="error-card">
    <ul>
      <li v-for="err in errors" :key="err">{{ err }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.error-card {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: #d62f50;
  color: white;
  padding: 20px 20px 20px 0px;
  box-shadow: 6px 12px 36px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  font-size: 18px;
}
</style>
