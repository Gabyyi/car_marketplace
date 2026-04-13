<template>
  <header :class="headerClasses">
    <div class="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          <i class="pi pi-car text-xl"></i>
        </div>
        <span :class="logoClass"><router-link to="/" class="text-blue-500">CarBuy.ro</router-link></span>
      </div>

      <div v-if="!hideActions" class="flex items-center gap-3">
        <button
          type="button"
          :class="notifBtnClass"
          aria-label="Notifications"
        >
          <i class="pi pi-bell text-lg"></i>
        </button>
        <button
          v-if="isLoggedIn"
          type="button"
          @click="goToProfile"
          :class="notifBtnClass"
          aria-label="Profile"
        >
          <i class="pi pi-user text-lg"></i>
        </button>
        <router-link v-else to="/login" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Login</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const props = defineProps({ hideActions: { type: Boolean, default: false } })
const { theme } = useTheme()
const router = useRouter()

const username = ref(localStorage.getItem('username'))
const isLoggedIn = computed(() => !!username.value)

function onAuthChanged() {
  username.value = localStorage.getItem('username')
}

onMounted(() => {
  window.addEventListener('authChanged', onAuthChanged)
})
onUnmounted(() => {
  window.removeEventListener('authChanged', onAuthChanged)
})

function goToProfile() {
  router.push({ name: 'Profile' })
}

const headerClasses = computed(() => [
  'w-full',
  theme.value === 'dark' ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'
].join(' '))

const logoClass = computed(() => ['text-3xl', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))

const notifBtnClass = computed(() => [
  'h-10', 'w-10', 'rounded-full', 'transition',
  theme.value === 'dark' ? 'border border-gray-600 text-gray-200 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
].join(' '))
</script>