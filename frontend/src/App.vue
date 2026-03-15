<template>
  <main class="mx-auto w-full max-w-5xl px-4 md:px-8 lg:px-12">
    <HeaderBar :hide-actions="route.name === 'Login' || route.name === 'Signup'" />
    <router-view />
    <FooterBar />
  </main>
</template>

<script>
import { useRoute } from 'vue-router'
import FooterBar from './components/FooterBar.vue'
import HeaderBar from './components/HeaderBar.vue'

export default {
  name: 'App',
  components: { FooterBar, HeaderBar },
  setup() {
    const route = useRoute()
    return { route }
  }
}
</script>

<style>
body { margin: 0; }
h1 { margin-bottom: 12px }
</style>
