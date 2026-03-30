<template>
  <footer :class="footerClasses">
    <div class="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide" :class="titleClass">Language</h2>
        <select
          :class="selectClass"
          aria-label="Language"
        >
          <option>English</option>
          <option>Romanian</option>
          <option>French</option>
        </select>

        <h2 class="mt-5 text-sm font-medium uppercase tracking-wide" :class="titleClass">Appearance</h2>
        <select
          v-model="theme"
          :class="selectClass"
          aria-label="Appearance"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide" :class="titleClass">Company</h2>
        <ul class="mt-3 space-y-2 text-sm" :class="listClass">
          <li>About</li>
          <li>Careers</li>
          <li>Contact</li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide" :class="titleClass">Legal</h2>
        <ul class="mt-3 space-y-2 text-sm" :class="listClass">
          <li>Terms</li>
          <li>Privacy</li>
          <li>Cookies</li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide" :class="titleClass">Dealer</h2>
        <ul class="mt-3 space-y-2 text-sm" :class="listClass">
          <li>Dealer Login</li>
          <li>List Inventory</li>
          <li>Dealer Support</li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { computed } from 'vue'

const { theme } = useTheme()

const footerClasses = computed(() => {
  return [
    'mt-10',
    'border-t',
    'py-8',
    theme.value === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
  ].join(' ')
})

const titleClass = computed(() => theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900')
const listClass = computed(() => theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600')
const selectClass = computed(() => [
  'mt-3',
  'w-full',
  'border',
  'rounded-md',
  'px-3',
  'py-2',
  'text-sm',
  theme.value === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700',
  'focus:border-blue-500',
  'focus:outline-none'
].join(' '))
</script>