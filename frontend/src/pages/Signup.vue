<template>
  <div class="min-h-screen flex items-start justify-center bg-white py-6 px-4">
    <div class="w-full max-w-sm md:max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden relative">
      <div class="md:flex">
        <!-- Left: form -->
        <div class="p-6 w-full md:w-1/2">
          <!-- Top blue area with car icon -->
          <div class="-mx-6 h-40 bg-blue-500 flex items-center justify-end rounded-t-2xl mb-4 px-6">
              <i class="pi pi-car text-blue-400/40 text-9xl"></i>
          </div>

          <h1 class="text-3xl font-medium text-gray-900 text-center">Create your account</h1>
          <p class="text-center text-sm text-gray-500 mt-2 mb-4">Join CarBuy to list and manage your cars</p>

          <form @submit.prevent="onSubmit" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Name</label>
              <input v-model="name" type="text" required placeholder="John" class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-1">Email Address</label>
              <input v-model="email" type="email" required placeholder="name@example.com" class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-1">Password</label>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="Create a password" class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
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
              <label for="terms" class="text-sm text-gray-600">I agree to the <a href="#" class="text-blue-500">Terms</a> and <a href="#" class="text-blue-500">Privacy Policy</a></label>
            </div>

            <div>
              <button :disabled="!canSubmit" type="submit" class="w-full bg-blue-500 disabled:opacity-50 text-white py-3 rounded-lg text-lg font-medium shadow">Create account</button>
            </div>
          </form>

          <div class="mt-6 text-center text-sm text-gray-400">OR CONTINUE WITH</div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <button class="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm bg-white hover:shadow">
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="h-5" />
              <span>Google</span>
            </button>
            <button class="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm bg-white hover:shadow">
              <img src="https://www.svgrepo.com/show/494336/apple.svg" alt="Apple" class="h-5" />
              <span class="mt-0.5">Apple</span>
            </button>
          </div>

          <div class="mt-6 text-center text-sm text-gray-600">Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Log in</router-link></div>
        </div>

        <!-- Right: company text -->
        <div class="hidden md:flex md:w-1/2 p-8">
          <div class="mr-6 flex flex-col items-start mt-8 text-gray-900 max-w-xs">
            <h3 class="text-4xl font-medium">Why choose CarBuy</h3>
            <p class="mt-2 text-sm text-gray-900">We make buying and selling cars simple, secure and fast. Verified listings, easy financing, and dedicated support.</p>
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
    return { router }
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
    onSubmit() {
      if (!this.canSubmit) return
      // placeholder: create account
      this.router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
.pi { vertical-align: middle }
</style>
