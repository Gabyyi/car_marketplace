<template>
	<div :class="pageClasses">
		<div class="max-w-7xl mx-auto px-4 py-8">
			<div class="flex gap-6">
				<!-- Left sidebar: 20% -->
					<aside class="hidden md:block w-1/5">
					<div class="sticky top-8">
						<div :class="sidebarCardClasses">
							<div class="mb-4">
								<button type="button" :class="moreFiltersBtnClass" @click="handleMoreFilters">
									<i class="pi pi-sliders-h mr-2"></i>
									More Filters
								</button>
							</div>

							<label class="block text-sm mb-2" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-200'">Make</label>
							<select v-model="filters.make" :class="inputClass + ' mb-3'">
								<option value="">Any</option>
								<template v-for="(m, mi) in availableMakes" :key="mi">
									<option :value="m">{{ m }}</option>
								</template>
							</select>

							<label class="block text-sm mb-2" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-200'">Model</label>
							<select v-model="filters.model" :class="inputClass + ' mb-3'">
								<option value="">Any</option>
								<template v-for="(m, mi) in availableModels" :key="mi">
									<option :value="m">{{ m }}</option>
								</template>
							</select>

							<label class="block text-sm mb-2" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-200'">Price range</label>
							<div class="flex items-center gap-2 text-sm mb-4">
								<select v-model="filters.priceFrom" :class="inputClass + ' w-1/2'">
									<option value="">from</option>
									<option value="0">0</option>
									<option value="5000">5,000</option>
									<option value="10000">10,000</option>
									<option value="20000">20,000</option>
									<option value="30000">30,000</option>
									<option value="40000">40,000</option>
									<option value="50000">50,000</option>
								</select>
								<select v-model="filters.priceTo" :class="inputClass + ' w-1/2'">
									<option value="">to</option>
									<option value="10000">10,000</option>
									<option value="20000">20,000</option>
									<option value="30000">30,000</option>
									<option value="40000">40,000</option>
									<option value="50000">50,000</option>
									<option value="60000">60,000</option>
								</select>
							</div>

							<label class="block text-sm mb-2" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-200'">First registration</label>
							<div class="flex items-center gap-2 mb-4">
								<select v-model="filters.registrationFrom" :class="inputClass + ' w-1/2'">
									<option value="">from</option>
									<option value="2024">2024</option>
									<option value="2023">2023</option>
									<option value="2022">2022</option>
									<option value="2021">2021</option>
								</select>
								<select v-model="filters.registrationTo" :class="inputClass + ' w-1/2'">
									<option value="">to</option>
									<option value="2024">2024</option>
									<option value="2023">2023</option>
									<option value="2022">2022</option>
									<option value="2021">2021</option>
								</select>
							</div>

							<label class="block text-sm mb-2" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-200'">Mileage</label>
							<div class="flex items-center gap-2 mb-4">
								<select v-model="filters.mileageFrom" :class="inputClass + ' w-1/2'">
									<option value="">from</option>
									<option value="0">0</option>
									<option value="10000">10,000</option>
									<option value="20000">20,000</option>
									<option value="50000">50,000</option>
								</select>
								<select v-model="filters.mileageTo" :class="inputClass + ' w-1/2'">
									<option value="">to</option>
									<option value="20000">20,000</option>
									<option value="50000">50,000</option>
									<option value="100000">100,000</option>
								</select>
							</div>

							<button @click="applyFilters" :class="applyBtnClass">Apply</button>
							<button @click="resetFilters" :class="resetBtnClass">Reset</button>
						</div>
					</div>
				</aside>

				<!-- Right content: 80% -->
				<main class="flex-1 w-4/5">
					<div class="space-y-4">
						<!-- Top card: title, applied filters, sort -->
						<div :class="cardClasses">
							<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<h1 :class="headerTitleClass">{{ headerText }}</h1>
									<div class="mt-3 flex flex-wrap gap-2">
										<template v-for="(f, i) in appliedFilters" :key="i">
											<div :class="badgeClass">{{ f }}</div>
										</template>
									</div>
								</div>
								<div class="flex items-center gap-3 p-4">
									<button @click="handleMoreFilters" :class="mobileMoreFiltersBtnClass + ' md:hidden'">
										<i class="pi pi-sliders-h mr-2"></i>
										More
									</button>
									<label :class="labelClass">Sort by</label>
									<select v-model="sortOrder" :class="selectClass">
										<option value="standard">Standard</option>
										<option value="price-asc">Price (lowest first)</option>
										<option value="price-desc">Price (highest first)</option>
										<option value="km-asc">Mileage (lowest first)</option>
										<option value="km-desc">Mileage (highest first)</option>
										<option value="reg-oldest">First registration (oldest)</option>
										<option value="reg-newest">First registration (newest)</option>
									</select>
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<CarAdCard v-for="(ad, idx) in displayedAds" :key="ad.id || idx" :ad="ad" />
						</div>

						<div class="mt-6 flex flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between" :class="paginationCardClass">
							<div class="text-sm" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-600'">
								Page {{ currentPage }} of {{ totalPages }} · {{ totalAds }} cars
							</div>
							<div class="flex items-center gap-2">
								<button type="button" @click="prevPage" :disabled="!canPrev" :class="paginationBtnClass + ' disabled:opacity-40 disabled:cursor-not-allowed'">
									Previous
								</button>
								<button type="button" @click="nextPage" :disabled="!canNext" :class="paginationBtnClass + ' disabled:opacity-40 disabled:cursor-not-allowed'">
									Next
								</button>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CarAdCard from '../components/CarAdCard.vue'
import { useTheme } from '../composables/useTheme'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const route = useRoute()
const router = useRouter()

const { theme } = useTheme()

const pageClasses = computed(() => [
	theme.value === 'dark' ? 'bg-gray-900' : 'bg-white'
].join(' '))

const cardClasses = computed(() => [
	'overflow-hidden', 'rounded-2xl', 'shadow-sm',
	theme.value === 'dark' ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'
].join(' '))

const headerTitleClass = computed(() => [
	'text-2xl', 'font-medium', 'pt-5', 'pb-5', 'pl-3',
	theme.value === 'dark' ? 'text-gray-200' : 'text-gray-700'
].join(' '))

const badgeClass = computed(() => {
	return [
		'px-3', 'py-1', 'rounded', 'text-sm', 'border',
		theme.value === 'dark' ? 'bg-[#0f1720] text-gray-300 border-[#212731]' : 'bg-white text-gray-700 border-gray-200'
	].join(' ')
})

const labelClass = computed(() => ['text-sm', 'mr-2', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-500'].join(' '))

const selectClass = computed(() => {
	return ['text-sm', 'px-3', 'py-2', 'rounded-md', 'shadow-sm', theme.value === 'dark' ? 'border border-gray-500 text-gray-300 bg-gray-800' : 'border border-gray-400 text-gray-500 bg-white'].join(' ')
})

const mobileMoreFiltersBtnClass = computed(() => ['px-2', 'py-1', 'text-sm', 'rounded-md', 'flex', 'items-center', 'justify-center', 'gap-2', theme.value === 'dark' ? 'border border-purple-500 text-purple-300 bg-gray-800' : 'border border-purple-300 text-purple-600 bg-white'].join(' '))

const inputClass = computed(() => ['w-full', 'px-1', 'py-1', 'rounded-md', 'text-sm', theme.value === 'dark' ? 'bg-gray-800 border border-gray-700 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'].join(' '))

const moreFiltersBtnClass = computed(() => ['w-full', 'px-4', 'py-2', 'text-sm', 'rounded-lg', 'border-2', 'flex', 'items-center', 'justify-center', 'gap-2', theme.value === 'dark' ? 'border-purple-500 text-purple-300' : 'border-purple-300 text-purple-600'].join(' '))

const applyBtnClass = computed(() => ['w-full', 'py-2', 'text-sm', 'rounded-lg', theme.value === 'dark' ? 'bg-[#7b2aa8] hover:bg-[#70279a] text-white' : 'bg-[#7b2aa8] hover:bg-[#70279a] text-white'].join(' '))

const resetBtnClass = computed(() => ['w-full', 'mt-2', 'py-2', 'text-sm', 'rounded-lg', theme.value === 'dark' ? 'border border-gray-600 text-gray-300' : 'border border-gray-300 text-gray-700'].join(' '))

const sidebarCardClasses = computed(() => [
	'p-4', 'rounded-xl', 'shadow-sm',
	theme.value === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
].join(' '))

const sidebarTitleClass = computed(() => ['text-lg', 'font-semibold', 'mb-3', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))

const paginationCardClass = computed(() => theme.value === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white')
const paginationBtnClass = computed(() => ['rounded-lg', 'px-4', 'py-2', 'text-sm', 'font-medium', 'transition', theme.value === 'dark' ? 'border border-gray-600 text-gray-200 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'].join(' '))

const ads = ref([])

function resolveImageUrl(url) {
	if (!url) return ''
	if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
	if (url.startsWith('/uploads/')) return `${apiBaseUrl}${url}`
	return url
}

function parseNumber(value) {
	const numeric = Number(String(value ?? '').replace(/[^\d.]/g, ''))
	return Number.isFinite(numeric) ? numeric : 0
}

function mapAdToCard(ad) {
	const images = Array.isArray(ad?.details?.images) && ad.details.images.length ? ad.details.images : (ad?.images || [])
	const price = ad?.details?.price ?? ad?.vehicle?.price ?? ''
	const mileage = ad?.vehicle?.mileage ?? ''
	const reg = [ad?.vehicle?.regMonth, ad?.vehicle?.regYear].filter(Boolean).join(' ') || ad?.vehicle?.regDate || ad?.vehicle?.year || ''
	const power = ad?.vehicle?.motorPower ? `${ad.vehicle.motorPower}${ad?.vehicle?.motorPowerUnit ? ` ${ad.vehicle.motorPowerUnit}` : ''}` : ''
	const priceValue = parseNumber(price)

	return {
		id: ad?._id || '',
		images: images.map(resolveImageUrl),
		make: ad?.vehicle?.make || 'Car',
		model: ad?.vehicle?.model || 'Ad',
		subtitle: ad?.details?.title || ad?.vehicle?.subcategory || ad?.vehicle?.category || '',
		price: price ? String(price) : '0',
		priceScore: priceValue >= 100000 ? 5 : priceValue >= 70000 ? 4 : 3,
		valueRatingText: priceValue >= 100000 ? 'Premium deal' : priceValue >= 70000 ? 'Great value' : 'Good price',
		negotiable: String(ad?.details?.priceType || '').toLowerCase() !== 'fixed price',
		highlight: ad?.vehicle?.accidentDamaged || ad?.vehicle?.damaged || ad?.vehicle?.conditionNotes || ad?.details?.title || '',
		registration: reg,
		km: mileage ? `${new Intl.NumberFormat('en-US').format(parseNumber(mileage))}` : '',
		power,
		fuelType: ad?.vehicle?.fuel || '',
		location: [ad?.contact?.zip, ad?.contact?.city, ad?.contact?.country].filter(Boolean).join(' '),
		ad
	}
}

const displayedAds = computed(() => ads.value.map(mapAdToCard))

const carMakes = {
	BMW: ['3 Series', '5 Series', 'X3', 'X5', 'i3', 'M440i', 'Z4'],
	Audi: ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'RS6'],
	'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'A-Class'],
	Volkswagen: ['Golf', 'Passat', 'Tiguan', 'T-Roc', 'Polo', 'Arteon'],
	Ford: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Edge', 'Mustang'],
	Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Yaris', 'Prius'],
	Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Ridgeline', 'Odyssey'],
	Hyundai: ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'i30', 'Kona'],
	Skoda: ['Octavia', 'Superb', 'Fabia', 'Rapid', 'Karoq', 'Kodiaq'],
	Renault: ['Clio', 'Megane', 'Scenic', 'Kadjar', 'Captur', 'Duster']
}

const availableMakes = computed(() => Object.keys(carMakes).sort())

const makeOptions = computed(() => {
	const set = new Set()
	ads.value.forEach(a => {
		const make = String(a?.vehicle?.make || '').trim()
		if (make) set.add(make)
	})
	return Array.from(set)
})

	const modelOptions = computed(() => {
	const set = new Set()
	ads.value.forEach(a => {
		const make = String(a?.vehicle?.make || '').trim()
		const model = String(a?.vehicle?.model || '').trim()
		if (!filters.make || make === filters.make) {
			if (model) set.add(model)
		}
	})
	return Array.from(set)
})

const filters = reactive({
	q: '',
	make: '',
	model: '',
	priceFrom: '',
	priceTo: '',
	registrationFrom: '',
	registrationTo: '',
	mileageFrom: '',
	mileageTo: '',
	transmission: '',
	fuelType: '',
	bodyType: '',
	doors: '',
	color: '',
	condition: '',
	hasBatteryCert: false,
	accidentFree: false
})

const availableModels = computed(() => {
	if (!filters.make) return []
	return carMakes[filters.make] || []
})

watch(() => filters.make, () => {
	if (filters.model && !availableModels.value.includes(filters.model)) {
		filters.model = ''
	}
})

const sortOrder = ref('standard')
const currentPage = ref(1)
const pageSize = 25
const totalAds = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')
const mobileFiltersOpen = ref(false)

const headerText = computed(() => `${totalAds.value} cars found`)

const appliedFilters = computed(() => {
	const list = []
	if (filters.make) list.push(`Make: ${filters.make}`)
	if (filters.model) list.push(`Model: ${filters.model}`)
	if (filters.priceFrom) list.push(`Price from ${filters.priceFrom}`)
	if (filters.priceTo) list.push(`Price to ${filters.priceTo}`)
	if (filters.registrationFrom) list.push(`First reg from ${filters.registrationFrom}`)
	if (filters.registrationTo) list.push(`First reg to ${filters.registrationTo}`)
	if (filters.mileageFrom) list.push(`Mileage from ${filters.mileageFrom}`)
	if (filters.mileageTo) list.push(`Mileage to ${filters.mileageTo}`)
	if (filters.hasBatteryCert) list.push('Battery certificate')
	if (filters.accidentFree) list.push("Damaged vehicles: Don't show")
	return list
})

function buildQuery() {
	const params = new URLSearchParams({
		page: String(currentPage.value),
		limit: String(pageSize),
		sort: sortOrder.value
	})
	if (filters.q) params.set('q', filters.q)
	if (filters.make) params.set('make', filters.make)
	if (filters.model) params.set('model', filters.model)
	if (filters.priceFrom) params.set('priceFrom', filters.priceFrom)
	if (filters.priceTo) params.set('priceTo', filters.priceTo)
	if (filters.registrationFrom) params.set('registrationFrom', filters.registrationFrom)
	if (filters.registrationTo) params.set('registrationTo', filters.registrationTo)
	if (filters.mileageFrom) params.set('mileageFrom', filters.mileageFrom)
	if (filters.mileageTo) params.set('mileageTo', filters.mileageTo)
	if (filters.transmission) params.set('transmission', filters.transmission)
	if (filters.fuelType) params.set('fuelType', filters.fuelType)
	if (filters.bodyType) params.set('bodyType', filters.bodyType)
	if (filters.doors) params.set('doors', filters.doors)
	if (filters.color) params.set('color', filters.color)
	if (filters.condition) params.set('condition', filters.condition)
	if (filters.accidentFree) params.set('accidentFree', 'true')
	return params.toString()
}

function buildAdvancedQuery() {
	const query = {}
	if (filters.q) query.q = filters.q
	if (filters.make) query.make = filters.make
	if (filters.model) query.model = filters.model
	if (filters.priceFrom) query.priceFrom = filters.priceFrom
	if (filters.priceTo) query.priceTo = filters.priceTo
	if (filters.registrationFrom) query.registrationFrom = filters.registrationFrom
	if (filters.registrationTo) query.registrationTo = filters.registrationTo
	if (filters.mileageFrom) query.mileageFrom = filters.mileageFrom
	if (filters.mileageTo) query.mileageTo = filters.mileageTo
	if (filters.transmission) query.transmission = filters.transmission
	if (filters.fuelType) query.fuelType = filters.fuelType
	if (filters.bodyType) query.bodyType = filters.bodyType
	if (filters.doors) query.doors = filters.doors
	if (filters.color) query.color = filters.color
	if (filters.condition) query.condition = filters.condition
	if (filters.accidentFree) query.accidentFree = 'true'
	return query
}

function scrollToTop() {
	window.scrollTo(0, 0)
}

async function loadAds() {
	loading.value = true
	error.value = ''
	try {
		const response = await fetch(`${apiBaseUrl}/api/ads?${buildQuery()}`)
		const data = await response.json()
		if (!response.ok) throw new Error(data.message || 'Failed to load ads')
		ads.value = data.ads || []
		totalAds.value = Number(data.total || 0)
		totalPages.value = Number(data.totalPages || 1)
		currentPage.value = Number(data.page || currentPage.value)
	} catch (err) {
		console.error(err)
		error.value = 'Failed to load search results'
		ads.value = []
		totalAds.value = 0
		totalPages.value = 1
	} finally {
		loading.value = false
	}
}

function applyFilters() {
	currentPage.value = 1
	loadAds()
}

function openMobileFilters() {
	mobileFiltersOpen.value = true
	// placeholder: UX to open mobile filters can be implemented (drawer/modal)
}

function resetFilters() {
	filters.q = ''
	filters.make = ''
	filters.model = ''
	filters.priceFrom = ''
	filters.priceTo = ''
	filters.registrationFrom = ''
	filters.registrationTo = ''
	filters.mileageFrom = ''
	filters.mileageTo = ''
	filters.transmission = ''
	filters.fuelType = ''
	filters.bodyType = ''
	filters.doors = ''
	filters.color = ''
	filters.condition = ''
	filters.hasBatteryCert = false
	filters.accidentFree = false
	currentPage.value = 1
	loadAds()
}

	function handleMoreFilters() {
		router.push({ name: 'AdvancedSearch', query: buildAdvancedQuery() })
	}

function nextPage() {
	if (currentPage.value >= totalPages.value) return
	currentPage.value += 1
	scrollToTop()
	loadAds()
}

function prevPage() {
	if (currentPage.value <= 1) return
	currentPage.value -= 1
	scrollToTop()
	loadAds()
}

const canPrev = computed(() => currentPage.value > 1 && !loading.value)
const canNext = computed(() => currentPage.value < totalPages.value && !loading.value)

watch(sortOrder, () => {
	currentPage.value = 1
	loadAds()
})

onMounted(() => {
	// Read query parameters and populate filters
	if (route.query.make) filters.make = route.query.make
	if (route.query.model) filters.model = route.query.model
	if (route.query.priceFrom) filters.priceFrom = route.query.priceFrom
	if (route.query.priceTo) filters.priceTo = route.query.priceTo
	if (route.query.registrationFrom) filters.registrationFrom = route.query.registrationFrom
	if (route.query.registrationTo) filters.registrationTo = route.query.registrationTo
	if (route.query.mileageFrom) filters.mileageFrom = route.query.mileageFrom
	if (route.query.mileageTo) filters.mileageTo = route.query.mileageTo
	if (route.query.transmission) filters.transmission = route.query.transmission
	if (route.query.fuelType) filters.fuelType = route.query.fuelType
	if (route.query.bodyType) filters.bodyType = route.query.bodyType
	if (route.query.doors) filters.doors = route.query.doors
	if (route.query.color) filters.color = route.query.color
	if (route.query.condition) filters.condition = route.query.condition
	if (route.query.q) filters.q = route.query.q
	loadAds()
})

watch(() => filters.make, () => {
	if (filters.model && !availableModels.value.includes(filters.model)) {
		filters.model = ''
	}
})
</script>

<style scoped>
/* ensure left sidebar remains roughly 20% on medium and larger screens
	Note: class names with slashes must be escaped in CSS selectors */
.w-1\/5 { width: 20%; }
.w-4\/5 { width: 80%; }
</style>