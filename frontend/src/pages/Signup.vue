<template>
  <div :class="containerClass">
    <div :class="cardClass">
      <div class="md:flex">
        <!-- Left: form -->
        <div class="pl-4 pr-4 w-full md:w-1/2">
          <!-- Top blue area with car icon -->
          <div class="-mx-6 h-40 bg-blue-500 flex items-center justify-end rounded-t-2xl mb-4 px-6">
              <i class="pi pi-car text-blue-400/40 text-9xl"></i>
          </div>

          <h1 :class="headingClass">Create your account</h1>
          <p :class="subTextClass">Join CarBuy to list and manage your cars</p>

          <form @submit.prevent="onSubmit" class="space-y-4">
            <div>
              <label :class="labelClass">Name</label>
              <input v-model="name" type="text" required placeholder="John" :class="inputClass" />
            </div>

            <div>
              <label :class="labelClass">Email Address</label>
              <input v-model="email" type="email" required placeholder="name@example.com" :class="inputClass" />
            </div>

            <div>
              <label :class="labelClass">Password</label>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="Create a password" :class="inputClass" />
            </div>

            <!-- Password requirements -->
            <div class="mt-3 text-sm">
              <ul class="space-y-2">
                <li :class="{'text-green-600': meetsLength, 'text-gray-500': !meetsLength}" class="flex items-center gap-3">
                  <span class="w-4 h-4 inline-flex items-center justify-center rounded-full border" :class="meetsLength ? 'bg-green-600 text-white border-green-600' : 'border-gray-300'"></span>
                  <span>At least 8 characters</span>
                </li>
                <li :class="{'text-green-600': hasLetter, 'text-gray-500': !hasLetter}" class="flex items-center gap-3">
                  <span class="w-4 h-4 inline-flex items-center justify-center rounded-full border" :class="hasLetter ? 'bg-green-600 text-white border-green-600' : 'border-gray-300'"></span>
                  <span>Contains letters</span>
                </li>
                <li :class="{'text-green-600': hasNumberAndSymbol, 'text-gray-500': !hasNumberAndSymbol}" class="flex items-center gap-3">
                  <span class="w-4 h-4 inline-flex items-center justify-center rounded-full border" :class="hasNumberAndSymbol ? 'bg-green-600 text-white border-green-600' : 'border-gray-300'"></span>
                  <span>Contains numbers and symbols</span>
                </li>
              </ul>
            </div>
            
            <div class="flex items-center gap-2">
              <input id="terms" v-model="agree" type="checkbox" class="h-4 w-4" />
              <label for="terms" :class="subTextClass">I agree to the <a href="#" class="text-blue-500">Terms</a> and <a href="#" class="text-blue-500">Privacy Policy</a></label>
            </div>

            <div>
              <button :disabled="!canSubmit" type="submit" :class="primaryBtnClass">Create account</button>
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

          <div class="mt-6 text-center text-sm" :class="subTextClass">Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Log in</router-link></div>
        </div>

        <!-- Right: company text -->
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
  name: 'SignupPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
      showPassword: false
    }
  },
  setup() {
    const router = useRouter()
    const { theme } = useTheme()

    const containerClass = computed(() => ['min-h-screen flex items-start justify-center py-6 px-4', theme.value === 'dark' ? 'bg-gray-900' : 'bg-white'].join(' '))
    const cardClass = computed(() => ['w-full max-w-sm md:max-w-4xl rounded-2xl shadow-lg overflow-hidden relative', theme.value === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white'].join(' '))
    const headingClass = computed(() => ['text-3xl font-medium text-center', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
    const subTextClass = computed(() => ['text-center text-sm mt-2 mb-4', theme.value === 'dark' ? 'text-gray-400' : 'text-gray-500'].join(' '))
    const labelClass = computed(() => ['block text-sm mb-1', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700'].join(' '))
    const inputClass = computed(() => ['w-full rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', theme.value === 'dark' ? 'border border-gray-600 bg-gray-800 text-gray-200 focus:ring-gray-600' : 'border border-gray-200 bg-white text-gray-700 focus:ring-blue-200'].join(' '))
    const primaryBtnClass = computed(() => ['w-full py-3 rounded-lg text-lg font-medium shadow', 'bg-blue-500', 'text-white', 'disabled:opacity-50'].join(' '))
    const socialBtnClass = computed(() => ['flex items-center justify-center gap-2 border rounded-lg py-2 text-sm', theme.value === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white'].join(' '))
    const rightPanelTextClass = computed(() => ['mr-6 flex flex-col items-start mt-8 max-w-xs', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))

    return { router, containerClass, cardClass, headingClass, subTextClass, labelClass, inputClass, primaryBtnClass, socialBtnClass, rightPanelTextClass }
  },
  computed: {
    meetsLength() { return this.password && this.password.length >= 8 },
    hasLetter() { return /[A-Za-z]/.test(this.password || '') },
    hasNumber() { return /\d/.test(this.password || '') },
    hasSymbol() { return /[^A-Za-z0-9]/.test(this.password || '') },
    hasNumberAndSymbol() { return this.hasNumber && this.hasSymbol },
    canSubmit() {
      return this.name && this.email && this.password && this.agree && this.meetsLength && this.hasLetter && this.hasNumberAndSymbol
    }
  },
  methods: {
    async onSubmit() {
      if (!this.canSubmit) return
      try {
        const res = await fetch('http://localhost:4000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name, email: this.email, password: this.password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Signup failed')
        localStorage.setItem('token', data.token)
        if (data.user && data.user.username) {
          localStorage.setItem('username', data.user.username)
        }
        window.dispatchEvent(new Event('authChanged'))
        this.router.push({ name: 'Home' })
      } catch (err) {
        alert(err.message || 'Signup error')
      }
    }
  }
}
</script>

<style scoped>
.pi { vertical-align: middle }
</style>
