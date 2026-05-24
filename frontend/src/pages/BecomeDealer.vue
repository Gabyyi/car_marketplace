<template>
  <section :class="pageClass">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:py-12">
      <div class="overflow-hidden rounded-4xl border shadow-2xl" :class="shellClass">
        <div class="relative overflow-hidden p-6 sm:p-8 lg:p-10" :class="headerClass">
          <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-orange-500"></div>
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <span class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]" :class="pillClass">Dealer application</span>
              <h1 class="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl" :class="titleClass">Become a dealer</h1>
              <p class="mt-4 max-w-2xl text-base leading-7" :class="helperClass">
                Apply for dealership access and start managing inventory, promoted listings, and dealer profile details on the platform.
              </p>
            </div>

            <div class="rounded-3xl border px-4 py-3 text-sm" :class="statusChipClass">
              <span class="font-medium">Status:</span> {{ submissionState }}
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8 lg:p-10" :class="bodyClass">
          <div v-if="!isLoggedIn" :class="noticeCardClass">
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Login required</p>
            <p class="mt-3 text-sm leading-6 text-gray-300">Please log in first so we can connect the application to your account.</p>
            <router-link to="/login" class="mt-5 inline-flex rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">Log in</router-link>
          </div>

          <form v-else :class="formCardClass" @submit.prevent="submitApplication">
            <div class="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between" :class="dividerClass">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">Application form</p>
                <h2 class="mt-2 text-2xl font-semibold" :class="titleClass">Business details</h2>
              </div>
              <button type="button" :class="secondaryLinkClass" @click="fillFromProfile">Use profile data</button>
            </div>

            <div class="mt-6 space-y-6">
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label :class="labelClass">Company name</label>
                  <input v-model="form.companyName" type="text" :class="inputClass" placeholder="CarMax Auto SRL" />
                </div>

                <div>
                  <label :class="labelClass">Business type</label>
                  <select v-model="form.businessType" :class="selectClass">
                    <option value="">Select type</option>
                    <option value="independent">Independent dealer</option>
                    <option value="franchise">Franchise dealer</option>
                    <option value="importer">Importer</option>
                    <option value="fleet">Fleet seller</option>
                  </select>
                </div>

                <div>
                  <label :class="labelClass">Contact name</label>
                  <input v-model="form.contactName" type="text" :class="inputClass" placeholder="Alex Pop" />
                </div>

                <div>
                  <label :class="labelClass">Email</label>
                  <input v-model="form.email" type="email" :class="inputClass" placeholder="dealer@example.com" />
                </div>

                <div>
                  <label :class="labelClass">Phone</label>
                  <input v-model="form.phone" type="tel" :class="inputClass" placeholder="+40..." />
                </div>

                <div>
                  <label :class="labelClass">City</label>
                  <input v-model="form.city" type="text" :class="inputClass" placeholder="Bucharest" />
                </div>

                <div>
                  <label :class="labelClass">Website</label>
                  <input v-model="form.website" type="url" :class="inputClass" placeholder="https://..." />
                </div>

                <div>
                  <label :class="labelClass">Years in business</label>
                  <input v-model="form.yearsInBusiness" type="number" min="0" :class="inputClass" placeholder="5" />
                </div>
              </div>

              <div>
                <label :class="labelClass">Tell us about your dealership</label>
                <textarea v-model="form.message" rows="5" :class="textareaClass" placeholder="Tell us about your inventory, team, and why you want to join CarBuy as a dealer."></textarea>
              </div>

              <div v-if="currentApplication" class="rounded-3xl border px-4 py-4 text-sm" :class="footerCardClass">
                <p class="font-semibold" :class="titleClass">Latest application</p>
                <p class="mt-2" :class="helperClass">Status: {{ currentApplication.status || 'pending' }}</p>
                <p class="mt-1" :class="helperClass">Submitted on {{ formatDate(currentApplication.createdAt) }}</p>
              </div>

              <div>
                <label :class="labelClass">Inventory size</label>
                <select v-model="form.inventorySize" :class="selectClass">
                  <option value="">Select size</option>
                  <option value="1-10">1-10 cars</option>
                  <option value="11-50">11-50 cars</option>
                  <option value="51-150">51-150 cars</option>
                  <option value="150+">150+ cars</option>
                </select>
              </div>

              <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {{ successMessage }}
              </div>

              <div class="flex flex-col gap-3 sm:flex-row">
                <button type="button" :class="secondaryBtnClass" @click="router.push({ name: 'Profile' })">
                  Back to profile
                </button>
                <button type="submit" :disabled="submitting" :class="submitBtnClass" class="flex-1">
                  {{ submitting ? 'Submitting...' : 'Submit application' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { theme } = useTheme()
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const submissionState = ref('Draft')
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const currentApplication = ref(null)

const form = reactive({
  companyName: '',
  businessType: '',
  contactName: localStorage.getItem('username') || '',
  email: localStorage.getItem('email') || '',
  phone: localStorage.getItem('profilePhone') || '',
  city: '',
  website: '',
  yearsInBusiness: '',
  inventorySize: '',
  message: ''
})

const pageClass = computed(() => ['min-h-screen', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const shellClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-[#11192a]' : 'border-gray-200 bg-white')
const headerClass = computed(() => theme.value === 'dark'
  ? 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(180deg,_rgba(9,13,24,0.98),_rgba(17,25,42,0.98))] text-gray-100'
  : 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] text-gray-900'
)
const bodyClass = computed(() => theme.value === 'dark' ? 'bg-[#0c1321]' : 'bg-slate-50')
const noticeCardClass = computed(() => theme.value === 'dark'
  ? 'rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur'
  : 'rounded-3xl border border-gray-200 bg-white p-5 shadow-lg'
)
const formCardClass = computed(() => theme.value === 'dark'
  ? 'rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur'
  : 'rounded-3xl border border-gray-200 bg-white p-5 shadow-lg'
)
const footerCardClass = computed(() => theme.value === 'dark'
  ? 'rounded-3xl border border-white/10 bg-white/5 p-5'
  : 'rounded-3xl border border-gray-200 bg-white p-5'
)
const titleClass = computed(() => theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900')
const helperClass = computed(() => theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600')
const pillClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-blue-200 bg-blue-50 text-blue-700')
const statusChipClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-blue-100 bg-white text-gray-700')
const dividerClass = computed(() => theme.value === 'dark' ? 'border-white/10' : 'border-gray-200')
const labelClass = computed(() => ['block', 'text-sm', 'font-medium', 'mb-2', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700'].join(' '))
const inputClass = computed(() => ['w-full', 'rounded-2xl', 'border', 'px-4', 'py-3', 'text-sm', 'outline-none', 'transition', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-500/20', theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-100 placeholder:text-gray-500' : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400'].join(' '))
const textareaClass = computed(() => ['w-full', 'rounded-2xl', 'border', 'px-4', 'py-3', 'text-sm', 'outline-none', 'transition', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-500/20', theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-100 placeholder:text-gray-500' : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400'].join(' '))
const selectClass = computed(() => ['w-full', 'rounded-2xl', 'border', 'px-4', 'py-3', 'text-sm', 'outline-none', 'transition', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-500/20', theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-100' : 'border-gray-200 bg-white text-gray-900'].join(' '))
const submitBtnClass = computed(() => ['rounded-2xl', 'px-6', 'py-3', 'font-semibold', 'text-white', 'transition', 'bg-gradient-to-r', 'from-blue-500', 'to-cyan-500', 'shadow-lg', 'shadow-blue-500/20', 'hover:from-blue-400', 'hover:to-cyan-400', 'disabled:opacity-60'].join(' '))
const secondaryBtnClass = computed(() => ['rounded-2xl', 'px-6', 'py-3', 'font-medium', 'transition', theme.value === 'dark' ? 'border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'].join(' '))
const badgeClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-gray-200 bg-slate-50 text-gray-700')
const secondaryLinkClass = computed(() => ['rounded-full px-4 py-2 text-sm font-medium transition', theme.value === 'dark' ? 'border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'].join(' '))

function fillFromProfile() {
  form.contactName = localStorage.getItem('username') || form.contactName
  form.email = localStorage.getItem('email') || form.email
  form.phone = localStorage.getItem('profilePhone') || form.phone
}

function formatDate(value) {
  if (!value) return 'unknown'
  return new Date(value).toLocaleDateString()
}

async function loadCurrentApplication() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${apiBaseUrl}/api/dealer-applications/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json()
    if (response.ok && data.application) {
      currentApplication.value = data.application
      Object.assign(form, data.application)
      submissionState.value = data.application.status || 'Draft'
    }
  } catch (error) {
    console.warn('Failed to load dealer application', error)
  }
}

async function submitApplication() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.companyName || !form.businessType || !form.contactName || !form.email || !form.city || !form.inventorySize) {
    errorMessage.value = 'Please complete the required fields.'
    return
  }

  submitting.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${apiBaseUrl}/api/dealer-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to submit application')

    currentApplication.value = data.application
    submissionState.value = data.application?.status || 'pending'
    successMessage.value = 'Your dealer application has been submitted for review.'
    localStorage.setItem('dealerApplicationDraft', JSON.stringify(form))
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to submit application.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  try {
    const savedDraft = JSON.parse(localStorage.getItem('dealerApplicationDraft') || 'null')
    if (savedDraft && typeof savedDraft === 'object') {
      Object.assign(form, savedDraft)
    }
  } catch (error) {
    console.warn('Failed to restore dealer draft', error)
  }

  fillFromProfile()
  loadCurrentApplication()
})

watch(
  form,
  (value) => {
    localStorage.setItem('dealerApplicationDraft', JSON.stringify(value))
  },
  { deep: true }
)
</script>
