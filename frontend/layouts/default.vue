<template>
  <div>
    <nuxt />
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  margin: 0;
}

.container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Provides darkened background for modals. Content inside will be centered */
.modal-wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.title-block {
  text-align: center;
  height: 100px;
  padding-top: 20px;
  width: 85%;
  margin: 0 auto;
}
@media (max-width: 600px) {
  .title-block {
    width: 100%;
  }
}
</style>
