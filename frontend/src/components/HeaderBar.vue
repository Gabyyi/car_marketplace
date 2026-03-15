<template>
  <header class="w-full bg-white border-b border-gray-200">
    <div class="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          <i class="pi pi-car text-xl"></i>
        </div>
        <span class="text-3xl font-medium text-gray-900"><router-link to="/" class="text-blue-500">CarBuy.ro</router-link></span>
      </div>

      <div v-if="!hideActions" class="flex items-center gap-3">
        <button
          type="button"
          class="h-10 w-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          aria-label="Notifications"
        >
          <i class="pi pi-bell text-lg"></i>
        </button>
        <router-link to="/login" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Login</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderBar',
  props: {
    hideActions: { type: Boolean, default: false }
  }
}
</script>