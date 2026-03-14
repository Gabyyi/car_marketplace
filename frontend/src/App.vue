<template>
  <main>
    <h1>Car Marketplace (Vue + Vite)</h1>
    <HomePage />
  </main>
</template>

<script>
import HomePage from './pages/home.vue'
export default {
  name: 'App',
  components: { HomePage }
}
</script>

<style>
body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin: 16px; }
h1 { margin-bottom: 12px }
</style>
