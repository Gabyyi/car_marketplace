
<template>
	<div :class="pageClass">
		<div class="mx-auto max-w-7xl px-4 py-8">
			<div v-if="!isLoggedIn" :class="emptyAuthCardClass">
				<div class="max-w-xl">
					<div class="text-sm uppercase tracking-[0.3em] text-blue-500">My Profile</div>
					<h1 class="mt-3 text-4xl font-semibold">Sign in to manage your account, parked cars, and listings.</h1>
					<p class="mt-4 text-sm leading-6 text-gray-400">Use the profile area to update your contact details, change your password, review parked cars, and edit or delete your ads.</p>
					<div class="mt-6 flex gap-3">
						<router-link to="/login" class="rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600">Log in</router-link>
						<router-link to="/signup" class="rounded-xl border border-white/10 px-5 py-3 font-medium text-gray-100 transition hover:bg-white/5">Create account</router-link>
					</div>
				</div>
			</div>

			<div v-else class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside :class="sidebarClass">
					<div class="rounded-3xl border border-white/5 bg-white/5 p-5 backdrop-blur">
						<button type="button" class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition" :class="activeSection === 'account' ? activeNavClass : idleNavClass" @click="activeSection = 'account'">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
								<i class="pi pi-user text-xl"></i>
							</div>
							<div class="min-w-0">
								<div class="truncate text-lg font-semibold">{{ profile.username || 'User' }}</div>
								<div class="truncate text-sm text-gray-400">{{ profile.email || 'No email found' }}</div>
							</div>
						</button>

						<div class="my-4 border-t border-white/10"></div>

						<button type="button" class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition" :class="activeSection === 'parked' ? activeNavClass : idleNavClass" @click="activeSection = 'parked'">
							<i class="pi pi-heart text-lg"></i>
							<div>
								<div class="font-medium">Car park</div>
								<div class="text-sm text-gray-400">{{ parkedCars.length }} parked cars</div>
							</div>
						</button>

						<button type="button" class="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition" :class="activeSection === 'vehicles' ? activeNavClass : idleNavClass" @click="activeSection = 'vehicles'">
							<i class="pi pi-car text-lg"></i>
							<div>
								<div class="font-medium">My vehicles</div>
								<div class="text-sm text-gray-400">{{ myAds.length }} ads</div>
							</div>
						</button>

						<router-link to="/become-dealer" class="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition" :class="idleNavClass">
							<i class="pi pi-briefcase text-lg"></i>
							<div>
								<div class="font-medium">Become a dealer</div>
								<div class="text-sm text-gray-400">Apply for dealership access</div>
							</div>
						</router-link>

						<div class="my-4 border-t border-white/10"></div>

						<button type="button" class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition" :class="idleNavClass" @click="logout">
							<i class="pi pi-sign-out text-lg"></i>
							<div>
								<div class="font-medium">Log out</div>
								<div class="text-sm text-gray-400">End this session</div>
							</div>
						</button>
					</div>
				</aside>

				<section class="space-y-6">
					<div :class="panelClass">
						<div v-if="activeSection === 'account'" class="space-y-6">
							<div class="flex flex-wrap items-start justify-between gap-4">
								<div>
									<div class="text-sm uppercase tracking-[0.25em] text-blue-500">User</div>
									<h2 class="mt-2 text-3xl font-semibold">Account details</h2>
									<p class="mt-2 text-sm text-gray-400">Manage login data, contact data, and security settings from one place.</p>
								</div>
								<button type="button" class="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/5" @click="reloadProfile">Refresh</button>
							</div>

							<div class="grid gap-4">
								<div :class="cardClass">
									<div class="flex items-center gap-4">
										<div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/15 text-blue-300 text-2xl font-semibold">{{ initials }}</div>
										<div>
											<div class="text-lg font-semibold">{{ profile.username || '—' }}</div>
											<div class="text-sm text-gray-400">Member since {{ joinedAt }}</div>
										</div>
									</div>
									<div class="mt-5 grid gap-4">
										<div>
											<label class="mb-2 block text-sm text-gray-400">Email</label>
											<input v-model="profile.email" type="email" :class="formInputClass" />
										</div>
										<div>
											<label class="mb-2 block text-sm text-gray-400">Password</label>
											<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400">
												<span>••••••••</span>
												<button type="button" class="ml-auto text-blue-400 hover:text-blue-300" @click="openChangePassword">Change password</button>
											</div>
										</div>
									</div>
								</div>

								<div :class="cardClass">
									<div class="flex items-center justify-between gap-4">
										<div>
											<h3 class="text-xl font-semibold">Contact data</h3>
											<p class="mt-1 text-sm text-gray-400">Keep your public and account contact details up to date.</p>
										</div>
										<button type="button" class="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600" @click="saveProfile">Save</button>
									</div>

									<div class="mt-5 grid gap-4">
										<div>
											<label class="mb-2 block text-sm text-gray-400">Name</label>
											<input v-model="profile.username" type="text" :class="formInputClass" />
										</div>
										<div>
											<label class="mb-2 block text-sm text-gray-400">Address</label>
											<textarea v-model="profile.address" rows="3" :class="[formInputClass, 'resize-none']"></textarea>
										</div>
										<div>
											<label class="mb-2 block text-sm text-gray-400">Phone number</label>
											<input v-model="profile.phone" type="text" :class="formInputClass" placeholder="+40..." />
										</div>
									</div>
								</div>
							</div>

							<div :class="cardClass">
								<h3 class="text-xl font-semibold">Delete account</h3>
								<p class="mt-2 text-sm text-gray-400">This removes your account and all ads owned by it. This action is irreversible.</p>
								<button type="button" class="mt-4 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10" @click="openDeleteConfirm">Delete account</button>

								<!-- Change password modal -->
								<div v-if="showChangePasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
									<div class="w-full max-w-lg rounded-2xl bg-white p-6 text-left dark:bg-gray-900">
										<h4 class="text-lg font-semibold">Change password</h4>
										<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Provide your current password and pick a new one.</p>
										<div class="mt-4 grid gap-3">
											<input v-model="changePasswordForm.currentPassword" type="password" placeholder="Current password" class="w-full rounded-lg border px-3 py-2" />
											<input v-model="changePasswordForm.newPassword" type="password" placeholder="New password" class="w-full rounded-lg border px-3 py-2" />
											<input v-model="changePasswordForm.confirmPassword" type="password" placeholder="Confirm new password" class="w-full rounded-lg border px-3 py-2" />
										</div>
										<div class="mt-4 flex justify-end gap-3">
											<button class="rounded-xl border px-4 py-2" @click="closeChangePassword">Cancel</button>
											<button :disabled="changePasswordLoading" class="rounded-xl bg-blue-600 px-4 py-2 text-white" @click="confirmChangePassword">Save</button>
										</div>
										<p v-if="changePasswordErrors" class="mt-3 text-sm text-red-500">{{ changePasswordErrors }}</p>
									</div>
								</div>

								<!-- Delete confirmation modal -->
								<div v-if="showDeleteConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
									<div class="w-full max-w-lg rounded-2xl bg-white p-6 text-left dark:bg-gray-900">
										<h4 class="text-lg font-semibold">Confirm account deletion</h4>
										<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Type <strong>DELETE</strong> in the box to confirm removing your account and all ads.</p>
										<input v-model="deleteConfirmText" placeholder="Type DELETE to confirm" class="mt-4 w-full rounded-lg border px-3 py-2" />
										<div class="mt-4 flex justify-end gap-3">
											<button class="rounded-xl border px-4 py-2" @click="closeDeleteConfirm">Cancel</button>
											<button :disabled="deleteConfirmText !== 'DELETE' || deleteAccountLoading" class="rounded-xl bg-red-600 px-4 py-2 text-white" @click="confirmDeleteAccount">Delete</button>
										</div>
										<p v-if="deleteError" class="mt-3 text-sm text-red-500">{{ deleteError }}</p>
									</div>
								</div>
							</div>
						</div>

						<div v-else-if="activeSection === 'parked'" class="space-y-6">
							<div class="flex items-center justify-between gap-4">
								<div>
									<div class="text-sm uppercase tracking-[0.25em] text-blue-500">Car park</div>
									<h2 class="mt-2 text-3xl font-semibold">Parked cars</h2>
									<p class="mt-2 text-sm text-gray-400">Cars you saved while browsing will appear here.</p>
								</div>
								<button type="button" class="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/5" @click="loadParkedCars">Reload</button>
							</div>

							<div v-if="parkedCars.length" class="space-y-4">
								<article v-for="car in parkedCars" :key="car._id || car.id || car.details?.title" :class="listingRowClass">
									<img :src="firstImage(car)" class="h-28 w-36 shrink-0 rounded-2xl object-cover" />
									<div class="min-w-0 flex-1">
										<div class="flex flex-wrap items-start justify-between gap-4">
											<div class="min-w-0">
												<div class="truncate text-lg font-semibold">
													{{ car.details?.title || `${car.vehicle?.make || ''} ${car.vehicle?.model || ''}` }}
												</div>
												<div class="mt-1 text-sm text-gray-400">
													{{ car.vehicle?.make || '—' }} {{ car.vehicle?.model || '' }} · {{ car.vehicle?.year || car.vehicle?.regYear || '—' }}
												</div>
											</div>
											<div class="text-right">
												<div class="text-xl font-semibold text-orange-400">{{ priceDisplay(car) }}</div>
												<div class="text-xs text-gray-500">Saved to park</div>
											</div>
										</div>

										<div class="mt-4 flex flex-wrap gap-2">
											<router-link :to="`/car/${car._id || car.id}`" class="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/5">Open</router-link>
											<button type="button" class="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10" @click="removeParkedCar(car)">Remove</button>
										</div>
									</div>
								</article>
							</div>

							<div v-else :class="emptyStateClass">
								<div class="text-5xl text-blue-500/80"><i class="pi pi-heart"></i></div>
								<h3 class="mt-4 text-2xl font-semibold">No parked cars yet</h3>
								<p class="mt-2 max-w-xl text-sm text-gray-400">Use the Park action on a car page to save it here for later.</p>
							</div>
						</div>

						<div v-else class="space-y-6">
							<div class="flex items-center justify-between gap-4">
								<div>
									<div class="text-sm uppercase tracking-[0.25em] text-blue-500">My vehicles</div>
									<h2 class="mt-2 text-3xl font-semibold">Your ads</h2>
									<p class="mt-2 text-sm text-gray-400">Edit or delete ads you created.</p>
								</div>
								<router-link to="/post-ad" class="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">Create ad</router-link>
							</div>

							<div v-if="loadingAds" :class="emptyStateClass">Loading your ads...</div>
							<div v-else-if="myAds.length" class="space-y-4">
								<article v-for="ad in myAds" :key="ad._id" :class="listingRowClass">
									<img :src="firstImage(ad)" class="h-28 w-36 rounded-2xl object-cover" />
									<div class="min-w-0 flex-1">
										<div class="flex flex-wrap items-start justify-between gap-4">
											<div class="min-w-0">
												<div class="truncate text-lg font-semibold">{{ ad.details?.title || `${ad.vehicle?.make || ''} ${ad.vehicle?.model || ''}` }}</div>
												<div class="mt-1 text-sm text-gray-400">{{ ad.vehicle?.make }} {{ ad.vehicle?.model }} · {{ ad.vehicle?.year || ad.vehicle?.regYear || '—' }}</div>
											</div>
											<div class="text-right">
												<div class="text-xl font-semibold text-orange-400">{{ priceDisplay(ad) }}</div>
												<div class="text-xs text-gray-500">{{ formatDate(ad.createdAt) }}</div>
											</div>
										</div>

										<div class="mt-4 flex flex-wrap gap-2">
											<button type="button" class="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600" @click="editAd(ad._id)">Edit</button>
											<button type="button" class="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10" @click="deleteAd(ad._id)">Delete</button>
											<router-link :to="`/car/${ad._id}`" class="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/5">View</router-link>
										</div>
									</div>
								</article>
							</div>
							<div v-else :class="emptyStateClass">
								<div class="text-5xl text-blue-500/80"><i class="pi pi-car"></i></div>
								<h3 class="mt-4 text-2xl font-semibold">No ads yet</h3>
								<p class="mt-2 max-w-xl text-sm text-gray-400">Create your first listing and it will appear here for editing or deletion.</p>
								<router-link to="/post-ad" class="mt-5 inline-flex rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600">Create your first ad</router-link>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { theme } = useTheme()
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const activeSection = ref('account')
const loadingAds = ref(false)
const myAds = ref([])
const parkedCars = ref([])

// UI state for modals
const showChangePasswordModal = ref(false)
const showDeleteConfirmModal = ref(false)
const changePasswordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const changePasswordErrors = ref('')
const changePasswordLoading = ref(false)
const deleteConfirmText = ref('')
const deleteError = ref('')
const deleteAccountLoading = ref(false)

const profile = reactive({
  username: localStorage.getItem('username') || '',
  email: localStorage.getItem('email') || '',
  phone: localStorage.getItem('profilePhone') || '',
  address: localStorage.getItem('profileAddress') || ''
})

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function onAuthChanged() {
  profile.username = localStorage.getItem('username') || profile.username
  profile.email = localStorage.getItem('email') || profile.email
  loadParkedCars()
  loadMyAds()
}

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const initials = computed(() => (profile.username || 'U').trim().slice(0, 1).toUpperCase())
const joinedAt = computed(() => profile.email ? 'active account' : '—')

const pageClass = computed(() => ['min-h-screen', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const emptyAuthCardClass = computed(() => ['rounded-3xl border p-8', theme.value === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white shadow-sm'].join(' '))
const sidebarClass = computed(() => ['lg:sticky lg:top-8 self-start', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const panelClass = computed(() => ['rounded-[28px] border p-6 md:p-8', theme.value === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white shadow-sm'].join(' '))
const cardClass = computed(() => ['rounded-3xl border p-5', theme.value === 'dark' ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-slate-50'].join(' '))
const listingCardClass = computed(() => ['rounded-3xl border p-4', theme.value === 'dark' ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-slate-50'].join(' '))
const listingRowClass = computed(() => ['flex flex-col gap-4 rounded-3xl border p-4 md:flex-row md:items-center', theme.value === 'dark' ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-slate-50'].join(' '))
const emptyStateClass = computed(() => ['flex min-h-[260px] flex-col items-center justify-center rounded-3xl border text-center', theme.value === 'dark' ? 'border-dashed border-white/10 bg-black/20' : 'border-dashed border-gray-300 bg-slate-50'].join(' '))
const idleNavClass = computed(() => theme.value === 'dark' ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
const activeNavClass = computed(() => theme.value === 'dark' ? 'bg-blue-500/15 text-white ring-1 ring-blue-500/30' : 'bg-blue-50 text-gray-900 ring-1 ring-blue-200')
const formInputClass = computed(() => ['w-full rounded-2xl border px-4 py-3 text-sm outline-none transition', theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-100 placeholder:text-gray-500 focus:border-blue-400' : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-400'].join(' '))

function resolveImageUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  if (url.startsWith('/uploads/')) return `${apiBaseUrl}${url}`
  return `${apiBaseUrl}/${String(url).replace(/^\/+/, '')}`
}

function firstImage(item) {
  return resolveImageUrl(item?.images?.[0] || item?.details?.images?.[0] || item?.image || item?.thumbnail)
}

function priceDisplay(item) {
  const raw = item?.details?.price || item?.vehicle?.price || ''
  const price = String(raw).trim()
  return price ? `${item?.details?.currency || '€'} ${price}` : 'Price on request'
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

async function reloadProfile() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load profile')

    profile.username = data.user?.username || profile.username
    profile.email = data.user?.email || profile.email
    localStorage.setItem('username', profile.username)
    localStorage.setItem('email', profile.email)
    window.dispatchEvent(new Event('authChanged'))
  } catch (err) {
    console.error(err)
  }
}

async function loadMyAds() {
  const token = localStorage.getItem('token')
  if (!token) {
    myAds.value = []
    return
  }

  loadingAds.value = true
  try {
    const response = await fetch(`${apiBaseUrl}/api/ads/me`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load ads')
    myAds.value = Array.isArray(data.ads) ? data.ads : []
  } catch (err) {
    console.error(err)
    myAds.value = []
  } finally {
    loadingAds.value = false
  }
}

function loadParkedCars() {
  try {
    const stored = JSON.parse(localStorage.getItem('parkedCars') || '[]')
    parkedCars.value = Array.isArray(stored) ? stored : []
  } catch (err) {
    parkedCars.value = []
  }
}

function saveProfile() {
  localStorage.setItem('username', profile.username || '')
  localStorage.setItem('email', profile.email || '')
  localStorage.setItem('profilePhone', profile.phone || '')
  localStorage.setItem('profileAddress', profile.address || '')
  window.dispatchEvent(new Event('authChanged'))
  alert('Profile saved')
}

function openChangePassword() {
	changePasswordForm.currentPassword = ''
	changePasswordForm.newPassword = ''
	changePasswordForm.confirmPassword = ''
	changePasswordErrors.value = ''
	showChangePasswordModal.value = true
}

function closeChangePassword() {
	showChangePasswordModal.value = false
}

async function confirmChangePassword() {
	changePasswordErrors.value = ''
	if (!changePasswordForm.currentPassword || !changePasswordForm.newPassword) {
		changePasswordErrors.value = 'Please fill all fields.'
		return
	}
	if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
		changePasswordErrors.value = 'New passwords do not match.'
		return
	}

	changePasswordLoading.value = true
	try {
		const response = await fetch(`${apiBaseUrl}/api/auth/password`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', ...authHeaders() },
			body: JSON.stringify({ currentPassword: changePasswordForm.currentPassword, newPassword: changePasswordForm.newPassword })
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.message || 'Failed to reset password')
		alert('Password updated')
		closeChangePassword()
	} catch (err) {
		changePasswordErrors.value = err.message || 'Password reset failed'
	} finally {
		changePasswordLoading.value = false
	}
}

function openDeleteConfirm() {
	deleteConfirmText.value = ''
	deleteError.value = ''
	showDeleteConfirmModal.value = true
}

function closeDeleteConfirm() {
	showDeleteConfirmModal.value = false
}

async function confirmDeleteAccount() {
	if (deleteConfirmText.value !== 'DELETE') return
	deleteAccountLoading.value = true
	deleteError.value = ''
	try {
		const response = await fetch(`${apiBaseUrl}/api/auth/account`, {
			method: 'DELETE',
			headers: authHeaders()
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.message || 'Failed to delete account')

		localStorage.removeItem('token')
		localStorage.removeItem('username')
		localStorage.removeItem('email')
		localStorage.removeItem('profilePhone')
		localStorage.removeItem('profileAddress')
		window.dispatchEvent(new Event('authChanged'))
		closeDeleteConfirm()
		router.push({ name: 'Home' })
	} catch (err) {
		deleteError.value = err.message || 'Delete account failed'
	} finally {
		deleteAccountLoading.value = false
	}
}

async function deleteAd(adId) {
  if (!window.confirm('Delete this ad?')) return
  try {
    const response = await fetch(`${apiBaseUrl}/api/ads/${adId}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to delete ad')
    myAds.value = myAds.value.filter(ad => ad._id !== adId)
  } catch (err) {
    alert(err.message || 'Delete ad failed')
  }
}

function editAd(adId) {
  router.push({ name: 'PostAd', query: { edit: adId } })
}

function removeParkedCar(car) {
  parkedCars.value = parkedCars.value.filter(item => String(item._id || item.id) !== String(car._id || car.id))
  localStorage.setItem('parkedCars', JSON.stringify(parkedCars.value))
}

function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('username')
	localStorage.removeItem('email')
	window.dispatchEvent(new Event('authChanged'))
	router.push({ name: 'Home' })
}

onMounted(() => {
	window.addEventListener('authChanged', onAuthChanged)
	reloadProfile()
	loadParkedCars()
	loadMyAds()
})
onUnmounted(() => {
	window.removeEventListener('authChanged', onAuthChanged)
})
</script>

<style scoped>
.formInput { background: transparent; }
</style>