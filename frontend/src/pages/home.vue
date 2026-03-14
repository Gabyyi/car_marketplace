<template>
  <section>
    <h2>Home</h2>
    <p>Welcome to the Car Marketplace frontend. This is the test Home component.</p>
    <button @click="inc">Click count: {{ count }}</button>
  </section>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'HomePage',
  setup () {
    const count = ref(0)
    const inc = () => { count.value++ }
    return { count, inc }
  }
}
</script>

<style scoped>
section { padding: 8px; border: 1px solid #ddd; border-radius: 6px }
button { margin-top: 8px }
</style>
