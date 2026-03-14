<template>
  <main class="mx-auto w-full max-w-5xl px-4 md:px-8 lg:px-12">
    <HeaderBar />
    <HomePage />
    <FooterBar />
  </main>
</template>

<script>
import FooterBar from './components/FooterBar.vue'
import HeaderBar from './components/HeaderBar.vue'
import HomePage from './pages/home.vue'
export default {
  name: 'App',
  components: { FooterBar, HeaderBar, HomePage }
}
</script>

<style>
body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin: 0; }
h1 { margin-bottom: 12px }
</style>
