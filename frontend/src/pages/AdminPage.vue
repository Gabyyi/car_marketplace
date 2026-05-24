<template>
  <section :class="pageClass">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12">
      <div class="overflow-hidden rounded-4xl border shadow-2xl" :class="shellClass">
        <div class="relative overflow-hidden p-6 sm:p-8 lg:p-10" :class="heroClass">
          <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-orange-500"></div>
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <span class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]" :class="pillClass">Admin dashboard</span>
              <h1 class="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl" :class="titleClass">Moderate the marketplace</h1>
              <p class="mt-4 max-w-2xl text-base leading-7" :class="helperClass">
                Review dealer applications, adjust user roles, and remove problematic ads from a single control panel.
              </p>
            </div>

            <button type="button" :class="refreshBtnClass" @click="loadDashboard">Refresh data</button>
          </div>
        </div>

        <div class="p-6 sm:p-8 lg:p-10" :class="bodyClass">
          <div v-if="loading" class="rounded-3xl border px-4 py-4 text-sm" :class="panelClass">Loading dashboard...</div>
          <div v-else-if="errorMessage" class="rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-200">{{ errorMessage }}</div>
          <template v-else>
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div v-for="stat in statsCards" :key="stat.label" class="rounded-3xl border p-5 shadow-lg" :class="panelClass">
                <p class="text-sm font-medium uppercase tracking-[0.2em]" :class="mutedClass">{{ stat.label }}</p>
                <p class="mt-3 text-3xl font-semibold" :class="titleClass">{{ stat.value }}</p>
              </div>
            </div>

            <div class="mt-8 rounded-[28px] border p-5 sm:p-6" :class="panelClass">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Management sections</p>
                  <h2 class="mt-2 text-2xl font-semibold" :class="titleClass">Switch between dashboard areas</h2>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button type="button" :class="sectionButtonClass('applications')" @click="activeSection = 'applications'">Business applications</button>
                  <button type="button" :class="sectionButtonClass('users')" @click="activeSection = 'users'">Users management</button>
                  <button type="button" :class="sectionButtonClass('ads')" @click="activeSection = 'ads'">Car ads management</button>
                </div>
              </div>

              <div class="mt-6">
                <section v-if="activeSection === 'applications'">
                  <div v-if="pendingApplications.length === 0" class="rounded-2xl border border-dashed px-4 py-6 text-sm" :class="mutedPanelClass">
                    No pending dealer requests.
                  </div>

                  <div v-else class="space-y-4">
                    <article
                      v-for="application in pendingApplications"
                      :key="application._id"
                      role="button"
                      tabindex="0"
                      class="cursor-pointer rounded-3xl border p-4 sm:p-5 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      :class="cardClass"
                      @click="viewApplication(application._id)"
                      @keydown.enter.prevent="viewApplication(application._id)"
                      @keydown.space.prevent="viewApplication(application._id)"
                    >
                      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div class="flex flex-wrap items-center gap-2">
                            <h3 class="text-lg font-semibold" :class="titleClass">{{ application.companyName }}</h3>
                            <span class="rounded-full border px-3 py-1 text-xs font-medium" :class="statusClass(application.status)">
                              {{ application.status }}
                            </span>
                          </div>
                          <p class="mt-2 text-sm" :class="mutedClass">{{ application.businessType }} · {{ application.city }}</p>
                          <p class="mt-2 text-sm" :class="mutedClass">Contact: {{ application.contactName }} · {{ application.email }}</p>
                          <p class="mt-1 text-sm" :class="mutedClass">Inventory: {{ application.inventorySize }} · Years: {{ application.yearsInBusiness || 'n/a' }}</p>
                          <p v-if="application.message" class="mt-3 text-sm leading-6" :class="bodyTextClass">{{ application.message }}</p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                          <button type="button" :class="secondaryBtnClass" @click.stop="viewApplication(application._id)">Review</button>
                        </div>
                      </div>
                    </article>
                  </div>
                </section>

                <section v-else-if="activeSection === 'users'">
                  <div class="space-y-4">
                    <article
                      v-for="user in users"
                      :key="user._id"
                      class="rounded-3xl border p-4"
                      :class="cardClass"
                    >
                      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div class="flex flex-wrap items-center gap-2">
                            <h3 class="text-base font-semibold" :class="titleClass">{{ user.username }}</h3>
                            <span class="rounded-full border px-3 py-1 text-xs font-medium" :class="roleChipClass(user.role)">{{ user.role || 'user' }}</span>
                          </div>
                          <p class="mt-2 text-sm" :class="mutedClass">{{ user.email }}</p>
                          <p class="mt-1 text-xs uppercase tracking-[0.2em]" :class="mutedClass">{{ user.ads?.length || 0 }} ads</p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                          <select v-model="roleDrafts[user._id]" :class="selectClass">
                            <option value="user">user</option>
                            <option value="dealer">dealer</option>
                            <option value="admin">admin</option>
                          </select>
                          <button type="button" :class="secondaryBtnClass" @click="updateUserRole(user._id)">Save</button>
                          <button type="button" :class="dangerBtnClass" @click="deleteUser(user._id)">Delete</button>
                        </div>
                      </div>
                    </article>
                  </div>
                </section>

                <section v-else>
                  <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    <article
                      v-for="ad in ads"
                      :key="ad._id"
                      class="rounded-3xl border p-4"
                      :class="cardClass"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div>
                          <h3 class="text-lg font-semibold" :class="titleClass">
                            {{ ad.details?.title || `${ad.vehicle?.make || 'Car'} ${ad.vehicle?.model || 'Ad'}` }}
                          </h3>
                          <p class="mt-2 text-sm" :class="mutedClass">
                            {{ ad.vehicle?.make || '—' }} {{ ad.vehicle?.model || '—' }} · {{ ad.vehicle?.regYear || ad.vehicle?.year || 'n/a' }}
                          </p>
                          <p class="mt-1 text-sm" :class="mutedClass">Owner: {{ ad.owner?.username || 'Unknown' }}</p>
                          <p class="mt-1 text-sm font-semibold text-blue-400">{{ formatPrice(ad.details?.price ?? ad.vehicle?.price) }}</p>
                        </div>
                        <button type="button" :class="dangerBtnClass" @click="deleteAd(ad._id)">Delete</button>
                      </div>
                    </article>
                  </div>
                </section>
              </div>
            </div>

            <!-- Application detail modal -->
            <div v-if="selectedApplication" class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
              <div class="relative z-10 max-w-2xl w-full rounded-2xl p-6" :class="panelClass">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-xl font-semibold" :class="titleClass">{{ selectedApplication.companyName }}</h3>
                    <p class="mt-1 text-sm" :class="mutedClass">{{ selectedApplication.businessType }} · {{ selectedApplication.city }}</p>
                  </div>
                </div>

                <div class="mt-4 space-y-3 text-sm" :class="bodyTextClass">
                  <p><strong>Contact:</strong> {{ selectedApplication.contactName }} — {{ selectedApplication.email }} <span v-if="selectedApplication.phone">— {{ selectedApplication.phone }}</span></p>
                  <p v-if="selectedApplication.website"><strong>Website:</strong> <a :href="selectedApplication.website" target="_blank" class="text-blue-400 underline">{{ selectedApplication.website }}</a></p>
                  <p><strong>Inventory:</strong> {{ selectedApplication.inventorySize }} · <strong>Years:</strong> {{ selectedApplication.yearsInBusiness || 'n/a' }}</p>
                  <div v-if="selectedApplication.message" class="mt-2"><strong>Message:</strong><p class="mt-1 whitespace-pre-line">{{ selectedApplication.message }}</p></div>
                </div>

                <div class="mt-6 flex gap-2 justify-end">
                  <button type="button" :class="approveBtnClass" @click="reviewApplication(selectedApplication._id, 'approved')">Approve</button>
                  <button type="button" :class="rejectBtnClass" @click="reviewApplication(selectedApplication._id, 'rejected')">Reject</button>
                  <button type="button" :class="secondaryBtnClass" @click="closeModal">Close</button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { theme } = useTheme()
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const loading = ref(true)
const errorMessage = ref('')
const dashboard = reactive({ stats: { applications: 0, pendingApplications: 0, users: 0, ads: 0 }, applications: [], users: [], ads: [] })
const roleDrafts = reactive({})
const selectedApplication = ref(null)
const activeSection = ref('applications')

const pageClass = computed(() => ['min-h-screen', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const shellClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-[#11192a]' : 'border-gray-200 bg-white')
const heroClass = computed(() => theme.value === 'dark'
  ? 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(180deg,_rgba(9,13,24,0.98),_rgba(17,25,42,0.98))] text-gray-100'
  : 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] text-gray-900')
const bodyClass = computed(() => theme.value === 'dark' ? 'bg-[#0c1321]' : 'bg-slate-50')
const pillClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-blue-200 bg-blue-50 text-blue-700')
const titleClass = computed(() => theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900')
const helperClass = computed(() => theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600')
const mutedClass = computed(() => theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600')
const bodyTextClass = computed(() => theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700')
const panelClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-100 backdrop-blur' : 'border-gray-200 bg-white text-gray-900')
const mutedPanelClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-400' : 'border-gray-200 bg-slate-50 text-gray-600')
const cardClass = computed(() => theme.value === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-slate-50')
const selectClass = computed(() => ['rounded-2xl border px-3 py-2 text-sm outline-none transition', theme.value === 'dark' ? 'border-white/10 bg-[#0f172a] text-gray-100' : 'border-gray-200 bg-white text-gray-900'].join(' '))
const refreshBtnClass = computed(() => ['inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition', theme.value === 'dark' ? 'border border-white/10 bg-white/5 text-gray-100 hover:bg-white/10' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'].join(' '))
const approveBtnClass = computed(() => ['rounded-2xl px-4 py-2 text-sm font-semibold text-white transition bg-emerald-500 hover:bg-emerald-400'].join(' '))
const rejectBtnClass = computed(() => ['rounded-2xl px-4 py-2 text-sm font-semibold text-white transition bg-rose-500 hover:bg-rose-400'].join(' '))
const secondaryBtnClass = computed(() => ['rounded-2xl px-4 py-2 text-sm font-semibold transition', theme.value === 'dark' ? 'border border-white/10 bg-white/5 text-gray-100 hover:bg-white/10' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'].join(' '))
const dangerBtnClass = computed(() => ['rounded-2xl px-4 py-2 text-sm font-semibold text-white transition bg-red-500 hover:bg-red-400'].join(' '))

function sectionButtonClass(section) {
  const base = 'rounded-2xl px-4 py-3 text-sm font-semibold transition'
  if (activeSection.value === section) {
    return [base, 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'].join(' ')
  }
  return [base, theme.value === 'dark' ? 'border border-white/10 bg-white/5 text-gray-100 hover:bg-white/10' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'].join(' ')
}

const statsCards = computed(() => [
  { label: 'Dealer requests', value: dashboard.stats.applications },
  { label: 'Pending review', value: dashboard.stats.pendingApplications },
  { label: 'Users', value: dashboard.stats.users },
  { label: 'Car ads', value: dashboard.stats.ads }
])

const pendingApplications = computed(() => dashboard.applications.filter((item) => item.status === 'pending'))
const users = computed(() => dashboard.users)
const ads = computed(() => dashboard.ads)

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function ensureAdminAccess() {
  const token = localStorage.getItem('token')
  if (!token) {
    errorMessage.value = 'Please log in as an admin to access this page.'
    loading.value = false
    return false
  }

  const localRole = localStorage.getItem('role')
  if (localRole !== 'admin') {
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/me`, { headers: authHeaders() })
      const data = await response.json()
      if (!response.ok || data.user?.role !== 'admin') {
        errorMessage.value = 'Admin access required.'
        loading.value = false
        return false
      }
      localStorage.setItem('role', 'admin')
    } catch (error) {
      errorMessage.value = 'Admin access required.'
      loading.value = false
      return false
    }
  }

  return true
}

function syncRoleDrafts() {
  dashboard.users.forEach((user) => {
    roleDrafts[user._id] = roleDrafts[user._id] || user.role || 'user'
  })
}

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/overview`, {
      headers: authHeaders()
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load dashboard')

    dashboard.stats = data.stats || dashboard.stats
    dashboard.applications = data.applications || []
    dashboard.users = data.users || []
    dashboard.ads = data.ads || []
    syncRoleDrafts()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to load dashboard.'
  } finally {
    loading.value = false
  }
}

async function reviewApplication(id, status) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/dealer-applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Unable to update application')
    // close modal if the reviewed application is currently open
    if (selectedApplication.value && selectedApplication.value._id === id) selectedApplication.value = null
    await loadDashboard()
  } catch (error) {
    alert(error?.message || 'Unable to update application')
  }
}

async function viewApplication(id) {
  // try to fetch full application from API, fall back to loaded dashboard data
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/dealer-applications/${id}`, { headers: authHeaders() })
    if (response.ok) {
      const data = await response.json()
      selectedApplication.value = data.application || data
      return
    }
  } catch (e) {
    // ignore and fallback
  }

  // fallback: find in dashboard
  const found = dashboard.applications.find((a) => a._id === id)
  if (found) selectedApplication.value = found
}

function closeModal() {
  selectedApplication.value = null
}

async function updateUserRole(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ role: roleDrafts[id] || 'user' })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Unable to update user')
    await loadDashboard()
  } catch (error) {
    alert(error?.message || 'Unable to update user')
  }
}

async function deleteUser(id) {
  if (!confirm('Delete this user and their ads?')) return
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Unable to delete user')
    await loadDashboard()
  } catch (error) {
    alert(error?.message || 'Unable to delete user')
  }
}

async function deleteAd(id) {
  if (!confirm('Delete this car ad?')) return
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/ads/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Unable to delete ad')
    await loadDashboard()
  } catch (error) {
    alert(error?.message || 'Unable to delete ad')
  }
}

function formatPrice(value) {
  if (value === undefined || value === null || value === '') return 'Price on request'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(value))
}

function statusClass(status) {
  if (status === 'approved') return theme.value === 'dark' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (status === 'rejected') return theme.value === 'dark' ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'
  return theme.value === 'dark' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-700'
}

function roleChipClass(role) {
  if (role === 'admin') return theme.value === 'dark' ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200' : 'border-cyan-200 bg-cyan-50 text-cyan-700'
  if (role === 'dealer') return theme.value === 'dark' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-gray-200 bg-slate-50 text-gray-600'
}

onMounted(async () => {
  const canAccess = await ensureAdminAccess()
  if (!canAccess) return
  await loadDashboard()
})
</script>