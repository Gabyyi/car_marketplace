<template>
  <div :class="containerClass">
    <div :class="cardClass">
        <!-- Content: form + right panel -->
        <div class="md:flex">
          <!-- Left: form -->
          <div class="pl-4 pr-4 w-full md:w-1/2">
            <!-- Top blue area with car icon (only above the form) -->
            <div class="-mx-6 h-40 bg-blue-500 flex items-center justify-end mb-4 px-6 rounded-t-2xl">
                <i class="pi pi-car text-blue-400/40 text-9xl"></i>
            </div>
        <h1 :class="headingClass">Welcome back</h1>
        <p :class="subTextClass">Log in to manage your listings and messages</p>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label :class="labelClass">Email Address</label>
            <input v-model="email" type="email" required placeholder="name@example.com" :class="inputClass" />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label :class="labelClass">Password</label>
              <a href="#" class="text-sm text-blue-500 hover:underline">Forgot Password?</a>
            </div>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="Enter your password" :class="inputClass" />
              <button type="button" @click="toggleShow" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.172 3.172a4 4 0 015.656 0L12 6.343l3.172-3.171a4 4 0 115.656 5.656L17.657 12l3.171 3.172a4 4 0 11-5.656 5.656L12 17.657l-3.172 3.171a4 4 0 11-5.656-5.656L6.343 12 3.172 8.828a4 4 0 010-5.656z"/></svg>
              </button>
            </div>
          </div>

          <div>
            <button type="submit" :class="primaryBtnClass">Log In</button>
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-400">OR CONTINUE WITH</div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <button :class="socialBtnClass">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="h-5" />
            <span>Google</span>
          </button>
          <button :class="socialBtnClass">
            <img src="https://www.svgrepo.com/show/494336/apple.svg" alt="Apple" class="h-5" />
            <span class="mt-0.5">Apple</span>
          </button>
        </div>

        <div class="mt-6 text-center text-sm" :class="subTextClass">Don't have an account? <router-link to="/signup" class="text-blue-500 hover:underline">Sign up</router-link></div>
      </div>

      <!-- Right: blue panel with large car icon and company text (visible on md+) -->
      <div class="hidden md:flex md:w-1/2 p-8">
        <div :class="rightPanelTextClass">
          <h3 class="text-4xl font-medium">Why choose CarBuy</h3>
          <p class="mt-2 text-sm">We make buying and selling cars simple, secure and fast. Verified listings, easy financing, and dedicated support.</p>
          <ul class="mt-3 text-sm space-y-2 list-none">
            <li class="flex items-start gap-2"><i class="pi pi-check  text-blue-600"></i> Sellers & inspections</li>
            <li class="flex items-start gap-2"><i class="pi pi-check  text-blue-600"></i> Transparent pricing & history</li>
            <li class="flex items-start gap-2"><i class="pi pi-check  text-blue-600"></i> Fast financing options</li>
          </ul>
        </div>
            <i class="pi pi-car text-blue-400/40 text-[10rem] md:text-[14rem] lg:text-[20rem] absolute -bottom-10 right-6 transform rotate-[-25deg]"></i>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

export default {
  name: 'LoginPage',
  data() {
    return { email: '', password: '', showPassword: false }
  },
  setup() {
    const router = useRouter()
    const { theme } = useTheme()

    const containerClass = computed(() => ['flex items-center justify-center rounded-lg p-4', theme.value === 'dark' ? 'bg-gray-900' : 'bg-white'].join(' '))
    const cardClass = computed(() => ['w-full max-w-sm md:max-w-4xl rounded-xl shadow-lg overflow-hidden relative', theme.value === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white'].join(' '))
    const headingClass = computed(() => ['text-3xl font-medium text-center', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
    const subTextClass = computed(() => ['text-center text-sm mt-2 mb-4', theme.value === 'dark' ? 'text-gray-400' : 'text-gray-500'].join(' '))
    const labelClass = computed(() => ['block text-sm mb-1', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700'].join(' '))
    const inputClass = computed(() => ['w-full rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', theme.value === 'dark' ? 'border border-gray-600 bg-gray-800 text-gray-200 focus:ring-gray-600' : 'border border-gray-200 bg-white text-gray-700 focus:ring-blue-200'].join(' '))
    const primaryBtnClass = computed(() => ['w-full py-3 rounded-lg text-lg font-medium shadow', 'bg-blue-500', 'text-white'].join(' '))
    const socialBtnClass = computed(() => ['flex items-center justify-center gap-2 border rounded-lg py-2 text-sm', theme.value === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white'].join(' '))
    const rightPanelTextClass = computed(() => ['mr-6 flex flex-col items-start mt-8 max-w-xs', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))

    return { router, containerClass, cardClass, headingClass, subTextClass, labelClass, inputClass, primaryBtnClass, socialBtnClass, rightPanelTextClass }
  },
  methods: {
    async onSubmit() {
      try {
        const res = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Login failed')
        localStorage.setItem('token', data.token)
        this.router.push({ name: 'Home' })
      } catch (err) {
        alert(err.message || 'Login error')
      }
    },
    back() {
      this.router.back()
    },
    toggleShow() { this.showPassword = !this.showPassword }
  }
}
</script>

<style scoped>
.pi { vertical-align: middle }
</style>
