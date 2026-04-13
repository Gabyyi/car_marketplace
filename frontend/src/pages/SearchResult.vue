<template>
	<div :class="pageClasses">
		<div class="max-w-7xl mx-auto px-4 py-8">
			<div class="flex gap-6">
				<!-- Left sidebar: 20% -->
					<aside class="hidden md:block w-1/5">
					<div class="sticky top-8">
						<div :class="sidebarCardClasses">
							<div class="mb-4">
								<button type="button" :class="moreFiltersBtnClass">
									<i class="pi pi-sliders-h mr-2"></i>
									More Filters
								</button>
							</div>

							<label class="block text-sm mb-2" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-200'">Make</label>
							<select v-model="filters.make" :class="inputClass + ' mb-3'">
								<option value="">Any</option>
								<template v-for="(m, mi) in makeOptions" :key="mi">
									<option :value="m">{{ m }}</option>
								</template>
							</select>

							<label class="block text-sm mb-2" :class="theme.value === 'dark' ? 'text-gray-300' : 'text-gray-200'">Model</label>
							<select v-model="filters.model" :class="inputClass + ' mb-3'">
								<option value="">Any</option>
								<template v-for="(m, mi) in modelOptions" :key="mi">
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
									<button @click="openMobileFilters" :class="mobileMoreFiltersBtnClass + ' md:hidden'">
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
							<CarAdCard v-for="(ad, idx) in filteredAds" :key="idx" :ad="ad" />
						</div>
					</div>
				</main>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import CarAdCard from '../components/CarAdCard.vue'
import { useTheme } from '../composables/useTheme'

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

const ads = [
	// small sample list; real app should fetch from API/store
	{}, {}, {}, {}, {}
].map((_, i) => ({
	title: `Volkswagen ID.3 — Offer ${i + 1}`,
	subtitle: 'Pro FACELIFT 62kW ACC',
	price: 22990 + i * 1000,
	priceScore: 4,
	condition: i % 2 === 0 ? 'Accident-free' : 'Repaired accident damage',
	registration: 'FR 02/2024',
	km: 20000 + i * 5000,
	power: 150,
	hp: 204,
	images: ['/src/assets/placeholder-main.jpg','/src/assets/placeholder-1.jpg','/src/assets/placeholder-2.jpg','/src/assets/placeholder-3.jpg'],
	location: '83324 Ruhpolding',
	sellerType: 'Dealer'
}))

const makeOptions = computed(() => {
	const set = new Set()
	ads.forEach(a => {
		const mm = (a.title || '').split('—')[0].trim()
		const parts = mm.split(' ')
		const make = parts[0] || ''
		if (make) set.add(make)
	})
	return Array.from(set)
})

const modelOptions = computed(() => {
	const set = new Set()
	ads.forEach(a => {
		const mm = (a.title || '').split('—')[0].trim()
		const parts = mm.split(' ')
		const make = parts[0] || ''
		const model = parts.slice(1).join(' ') || ''
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
	hasBatteryCert: false,
	accidentFree: false
})

const sortOrder = ref('standard')
const mobileFiltersOpen = ref(false)

const makeModel = computed(() => {
	const sample = ads[0] && ads[0].title ? ads[0].title : ''
	const parts = sample.split('—')
	return (parts[0] || 'Listings').trim()
})

const headerText = computed(() => `${filteredAds.value.length} ${makeModel.value} offers`)

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

const filteredAds = computed(() => {
	let result = ads.filter(ad => {
		if (filters.q && !(`${ad.title} ${ad.subtitle}`.toLowerCase()).includes(filters.q.toLowerCase())) return false
		if (filters.make && !((ad.title || '').toLowerCase()).includes(filters.make.toLowerCase())) return false
		if (filters.model && !((ad.title || '').toLowerCase()).includes(filters.model.toLowerCase())) return false
		if (filters.priceFrom && Number(ad.price) < Number(filters.priceFrom)) return false
		if (filters.priceTo && Number(ad.price) > Number(filters.priceTo)) return false
		if (filters.mileageFrom && (ad.km || 0) < Number(filters.mileageFrom)) return false
		if (filters.mileageTo && (ad.km || 0) > Number(filters.mileageTo)) return false
		if (filters.registrationFrom) {
			const ay = Number((ad.registration || '').match(/\d{4}/)?.[0] || 0)
			if (ay < Number(filters.registrationFrom)) return false
		}
		if (filters.registrationTo) {
			const ay = Number((ad.registration || '').match(/\d{4}/)?.[0] || 0)
			if (ay > Number(filters.registrationTo)) return false
		}
		if (filters.accidentFree && ad.condition.toLowerCase().indexOf('accident') === -1) return false
		return true
	})

	// sorting
	const order = sortOrder.value
	if (order === 'price-asc') result = result.slice().sort((a,b) => a.price - b.price)
	else if (order === 'price-desc') result = result.slice().sort((a,b) => b.price - a.price)
	else if (order === 'km-asc') result = result.slice().sort((a,b) => (a.km || 0) - (b.km || 0))
	else if (order === 'km-desc') result = result.slice().sort((a,b) => (b.km || 0) - (a.km || 0))
	else if (order === 'reg-oldest') result = result.slice().sort((a,b) => {
		const ay = Number((a.registration || '').match(/\d{4}/)?.[0] || 0)
		const by = Number((b.registration || '').match(/\d{4}/)?.[0] || 0)
		return ay - by
	})
	else if (order === 'reg-newest') result = result.slice().sort((a,b) => {
		const ay = Number((a.registration || '').match(/\d{4}/)?.[0] || 0)
		const by = Number((b.registration || '').match(/\d{4}/)?.[0] || 0)
		return by - ay
	})

	return result
})

function applyFilters() {
	// computed will update automatically; keep for UX hooks
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
	filters.hasBatteryCert = false
	filters.accidentFree = false
}
</script>

<style scoped>
/* ensure left sidebar remains roughly 20% on medium and larger screens
	Note: class names with slashes must be escaped in CSS selectors */
.w-1\/5 { width: 20%; }
.w-4\/5 { width: 80%; }
</style>