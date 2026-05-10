<template>
	<section :class="containerClass">
		<main class="mx-auto w-full max-w-7xl px-4  ">
			<div class="m-4">
				<button @click.prevent="goBack" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:underline">
					<i class="pi pi-arrow-left"></i>
					<span>Back to your search results</span>
				</button>
			</div>
			<div class="mt-4 layout-card">
				<div class="grid gap-3 layout-70-30">
					<!-- Images Card -->
					<div>
						<div :class="cardClass">
							<div class="relative overflow-hidden">
								<img :src="currentImage" class="w-full h-96 object-cover rounded-t-xl" />

							<button @click="prev" :class="['absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 shadow', navButtonClass]">
									<i class="pi pi-chevron-left"></i>
								</button>
								<button @click="next" :class="['absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 shadow', navButtonClass]">
									<i class="pi pi-chevron-right"></i>
								</button>
							</div>

							<div class="p-2">
								<div class="mt-0 mb-3  flex items-center justify-center gap-3 overflow-x-auto py-1 px-2">
									<div v-for="(thumb, idx) in images" :key="idx" class="w-20 h-12 rounded-md overflow-hidden shrink-0 cursor-pointer" :class="idx === index ? 'ring-2 ring-blue-500' : 'ring-0'" @click="setIndex(idx)">
										<img :src="thumb" class="w-full h-full object-cover" />
									</div>
								</div>
							</div>
						</div>
					</div>
          
					<!-- Seller Card -->
					<aside ref="sellerRef" class="self-start">
						<div :class="sellerCardClass + ' p-6 space-y-4'" :style="sellerStyle">
							<!-- header: name above, price + indicator on same line below -->
							<div>
								<div class="text-base font-semibold">{{ car.make }} {{ car.model }}</div>

													<div class="mt-1 text-sm text-gray-400">{{ headlineDisplay }}</div>

								<div class="mt-2 flex items-center gap-3">
									<div class="text-2xl font-bold">${{ car.price }}</div>
									<div class="flex items-center gap-2 text-sm text-gray-400">
										<div class="price-badge flex items-center gap-1">
											<span class="bar bg-green-500"></span>
											<span class="bar bg-green-500"></span>
											<span class="bar bg-green-300"></span>
										</div>
										<div>Very good price</div>
									</div>
								</div>

								
							</div>

							<!-- financing -->
							<div class="text-sm text-gray-400">
								from <span class="font-medium">$650</span>/mo · <a href="#" class="text-blue-500">Calculate financing</a>
							</div>

							<div class="border-t pt-3"></div>

							<!-- seller/company -->
							<div>
								<div class="text-sm text-gray-400">{{ seller.name }}</div>
								<div class="mt-1 text-sm text-gray-400">{{ sellerShortAddress }}</div>
							</div>

							<!-- phone -->
							<div class="flex items-center justify-between flex-nowrap gap-2">
								<div class="text-sm text-gray-400 whitespace-nowrap">Phone: <span class="font-medium inline-block">{{ phoneDisplay }}</span></div>
								<button @click.prevent="togglePhone" class="text-sm text-blue-500 shrink-0">{{ phoneRevealed ? 'Hide' : 'Show' }}</button>
							</div>

							<!-- CTA buttons -->
							<div class="space-y-2">
								<button class="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 bg-blue-500 text-white shadow">
									<i class="pi pi-envelope"></i>
									<span>Write Email</span>
								</button>

								<div class="flex gap-2">
									<button @click.prevent="togglePark" class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 border-2 border-purple-600 text-purple-600">
										<i class="pi pi-heart"></i>
										<span>{{ isParked ? 'Parked' : 'Park' }}</span>
									</button>
									<button class="inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 border"> 
										<i class="pi pi-share-alt"></i>
										<span>Share</span>
									</button>
								</div>
							</div>

						</div>
					</aside>
				</div>
			</div>

      <!-- Specs Card -->
      <div class="mt-4 layout-card">
				<div class="grid gap-3 layout-70-30">
					<div :class="specCardClass + ' mt-4'">
						<div class="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-6">
							<!-- Item 1: Mileage (mobile: row1 col1, md: col1 row1) -->
							<div class="flex items-center gap-3" md:class="md:col-start-1 md:row-start-1">
								<i class="pi pi-map text-lg"></i>
								<div>
									<div class="font-medium">{{ car.mileage || '—' }} km</div>
									<div class="text-xs text-gray-400">Mileage</div>
								</div>
							</div>

							<!-- Item 2: Transmission (mobile: row1 col2, md: col1 row2) -->
							<div class="flex items-center gap-3" md:class="md:col-start-1 md:row-start-2">
								<i class="pi pi-cog text-lg"></i>
								<div>
									<div class="font-medium">{{ car.transmission || '—' }}</div>
									<div class="text-xs text-gray-400">Transmission</div>
								</div>
							</div>

							<!-- Item 3: Power (mobile: row2 col1, md: col2 row1) -->
							<div class="flex items-center gap-3" md:class="md:col-start-2 md:row-start-1">
								<i class="pi pi-bolt text-lg"></i>
								<div>
									<div class="font-medium">{{ car.stats?.power || car.specs?.power || '—' }}</div>
									<div class="text-xs text-gray-400">Power</div>
								</div>
							</div>

							<!-- Item 4: First registration (mobile: row2 col2, md: col2 row2) -->
							<div class="flex items-center gap-3" md:class="md:col-start-2 md:row-start-2">
								<i class="pi pi-calendar text-lg"></i>
								<div>
									<div class="font-medium">{{ car.year || '—' }}</div>
									<div class="text-xs text-gray-400">First registration</div>
								</div>
							</div>

							<!-- Item 5: Fuel (mobile: row3 col1, md: col3 row1) -->
							<div class="flex items-center gap-3" md:class="md:col-start-3 md:row-start-1">
								<i class="pi pi-shop text-lg"></i>
								<div>
									<div class="font-medium">{{ car.fuel || '—' }}</div>
									<div class="text-xs text-gray-400">Fuel</div>
								</div>
							</div>

							<!-- Item 6: Previous owners (mobile: row3 col2, md: col3 row2) -->
							<div class="flex items-center gap-3" md:class="md:col-start-3 md:row-start-2">
								<i class="pi pi-users text-lg"></i>
								<div>
									<div class="font-medium">{{ car.owners || '—' }}</div>
									<div class="text-xs text-gray-400">Previous owners</div>
								</div>
							</div>
						</div>
					</div>
        </div>
			</div>

      <!-- Technical Card -->
      <div class="mt-4 layout-card">
				<div class="grid gap-3 layout-70-30">
					<div :class="techCardClass + ' mt-4'">
						<h3 class="text-2xl font-medium ml-2 mb-3">Technical data</h3>
						<div>
							<div v-for="(item, i) in visibleTechnical" :key="i" :class="rowBg(i) + ' py-3 px-4 flex justify-between items-center'">
								<div class="text-sm font-medium">{{ item.label }}</div>
								<div class="text-sm text-gray-400">{{ item.value }}</div>
							</div>

							<div v-if="technical.length > visibleCount" class="mt-4 flex justify-center">
								<button @click.prevent="toggleShowMore" :class="['inline-flex items-center gap-2 px-6 py-2 rounded-md', showMoreClass]">
									<span v-if="!showMore">Show more</span>
									<span v-else>Show less</span>
								</button>
							</div>
						</div>
					</div>
        </div>
			</div>

      <!-- Features Card -->
      <div class="mt-4 layout-card">
				<div class="grid gap-3 layout-70-30">
					<div :class="featuresCardClass + ' mt-4'">
						<h3 class="text-2xl font-medium ml-2 mb-3">Features</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-3">
							<div v-for="(f, i) in visibleFeatures" :key="i" :class="featuresRowBg(i) + ' ' + featuresItemClass + ' flex items-center justify-between'">
								<div class="text-sm font-medium">{{ f.label }}</div>
								<i class="pi pi-check" :class="featuresCheckClass"></i>
							</div>
						</div>

						<div v-if="features.length > featuresVisibleCount" class="mt-4 flex justify-center">
							<button @click.prevent="toggleFeaturesShowMore" :class="['inline-flex items-center gap-2 px-6 py-2 rounded-md', featuresToggleClass]">
								<span v-if="!featuresShowMore">Show more</span>
								<span v-else>Show less</span>
							</button>
						</div>
					</div>
        </div>
      </div>

      <!-- Description Card -->
      <div class="mt-4 layout-card">
				<div class="grid gap-3 layout-70-30">
					<div :class="descriptionCardClass + ' mt-4'">
						<h3 class="text-2xl font-medium ml-2 mb-3">Description</h3>
						<div>
							<p class="text-sm text-gray-400 whitespace-pre-line ml-2">{{ visibleDescription }}</p>
						</div>

						<div v-if="description.length > descriptionVisibleCount" class="mt-4 flex justify-center">
							<button @click.prevent="toggleDescriptionShowMore" :class="['inline-flex items-center gap-2 px-6 py-2 rounded-md', descriptionToggleClass]">
								<span v-if="!descriptionShowMore">Show more</span>
								<span v-else>Show less</span>
							</button>
						</div>
					</div>
        </div>
      </div>
      
			<!-- About Seller / Dealer -->
			<div class="mt-4 layout-card">
				<div class="grid gap-3 layout-70-30">
					<div :class="sellerCardClass + ' mt-4'">
						<h3 class="text-2xl font-medium ml-2 mb-3">About seller / dealer</h3>
						<div class="flex items-start gap-4">
							<img :src="seller.avatar" alt="seller avatar" class="w-16 h-16 rounded-full object-cover" />
							<div class="flex-1">
								<div class="flex items-center justify-between">
									<div>
										<div class="font-medium text-base">{{ seller.name }}</div>
										<div class="text-sm text-gray-400">{{ seller.location }}</div>
									</div>
								</div>

								<div class="mt-3 text-sm text-gray-500">
									<div>Dealer since <span class="font-medium">{{ seller.since }}</span> · <span class="font-medium">{{ seller.carsSold }}+</span> cars sold</div>
									<div class="mt-1">Address: <span class="text-gray-400">{{ seller.address }}</span></div>
									<div class="mt-1">Opening hours: <span class="text-gray-400">{{ seller.openingHours }}</span></div>
								</div>

								<div class="mt-4 flex gap-2">
									<a :href="`tel:${seller.phone}`" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
										<i class="pi pi-phone"></i>
										<span>Call</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-4 layout-card" ref="similarSectionRef">
				<div class="w-full">
					<div :class="cardClass + ' mt-4'">
						<h3 class="text-2xl font-medium ml-6 mt-3">Similar cars</h3>
						<div class="relative">
							<button @click="scrollSimilarLeft" :class="['absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 shadow', navButtonClass]">
								<i class="pi pi-chevron-left"></i>
							</button>

							<div ref="similarRef" class="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 px-2 m-5">
								<SwipeCar v-for="(c, i) in similarCars" :key="i" :car="c" />
							</div>

							<button @click="scrollSimilarRight" :class="['absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 shadow', navButtonClass]">
								<i class="pi pi-chevron-right"></i>
							</button>
						</div>
					</div>
				</div>
			</div>

		</main>
	</section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import SwipeCar from '../components/SwipeCar.vue'

export default {
	name: 'CarAdPage',
 	components: { SwipeCar },
	setup() {
		const { theme } = useTheme()
		const router = useRouter()

		const route = useRoute()
		const id = route.params.id || route.query.id
		const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

		function resolveImageUrl(url) {
			if (!url) return ''
			if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
			if (url.startsWith('/uploads/')) return `${apiBaseUrl}${url}`
			return url
		}

		const images = ref([])
		const index = ref(0)
		const currentImage = computed(() => images.value.length ? images.value[index.value] : '')
		const similarCars = ref([])

		function next() { if (!images.value.length) return; index.value = (index.value + 1) % images.value.length }
		function prev() { if (!images.value.length) return; index.value = (index.value - 1 + images.value.length) % images.value.length }
		function setIndex(i) { index.value = i }

		function parseNumber(value) {
			const numeric = Number(String(value ?? '').replace(/[^\d.]/g, ''))
			return Number.isFinite(numeric) ? numeric : 0
		}

		function formatPrice(value) {
			return new Intl.NumberFormat('en-US').format(Math.round(value || 0))
		}

		function mapAdToSwipeCar(ad) {
			const price = parseNumber(ad?.details?.price || ad?.vehicle?.price)
			const mileage = parseNumber(ad?.vehicle?.mileage)
			const year = ad?.vehicle?.regYear || ad?.vehicle?.year || ''
			const image = (Array.isArray(ad?.details?.images) && ad.details.images.length ? ad.details.images[0] : (Array.isArray(ad?.images) ? ad.images[0] : '')) || ''
			return {
				id: ad?._id || '',
				image: resolveImageUrl(image),
				make: ad?.vehicle?.make || 'Car',
				model: ad?.vehicle?.model || 'Ad',
				price: formatPrice(price),
				year: year ? String(year) : '',
				kilometers: mileage ? `${new Intl.NumberFormat('en-US').format(mileage)} km` : '',
				power: ad?.vehicle?.motorPower ? `${ad.vehicle.motorPower}${ad?.vehicle?.motorPowerUnit ? ad.vehicle.motorPowerUnit : ''}` : '',
				gearbox: ad?.vehicle?.transmission || '',
				fuelType: ad?.vehicle?.fuel || '',
				location: [ad?.contact?.city, ad?.contact?.country].filter(Boolean).join(', ')
			}
		}

		const car = ref({ price: '', year: '', make: '', model: '', category: '', headline: '', description: '', options: [], stats: {}, specs: {} })
		const currentAd = ref(null)
		const isParked = ref(false)
		const headlineDisplay = computed(() => {
			const headline = car.value.headline || ''
			if (headline.length <= 27) return headline
			return `${headline.slice(0, 26)}…`
		})

		function readParkedCars() {
			try {
				const parsed = JSON.parse(localStorage.getItem('parkedCars') || '[]')
				return Array.isArray(parsed) ? parsed : []
			} catch (err) {
				return []
			}
		}

		function writeParkedCars(items) {
			localStorage.setItem('parkedCars', JSON.stringify(items))
		}

		function togglePark() {
			if (!currentAd.value) return
			const parked = readParkedCars()
			const adId = String(currentAd.value._id)
			const existingIndex = parked.findIndex(item => String(item?._id || item?.id) === adId)
			if (existingIndex === -1) {
				parked.unshift({
					_id: currentAd.value._id,
					vehicle: currentAd.value.vehicle,
					details: currentAd.value.details,
					contact: currentAd.value.contact,
					images: currentAd.value.images || currentAd.value.details?.images || [],
					createdAt: currentAd.value.createdAt
				})
				writeParkedCars(parked.slice(0, 50))
				isParked.value = true
			} else {
				parked.splice(existingIndex, 1)
				writeParkedCars(parked)
				isParked.value = false
			}
		}

		// additional mapped fields
		car.value.mileage = ''
		car.value.transmission = ''
		car.value.fuel = ''
		car.value.owners = ''

		const seller = ref({ name: '', avatar: '', location: '', city: '', zip: '', country: '', countryAbbrev: '', since: '', carsSold: 0, rating: 0, reviewsCount: 0, phone: '', website: '', address: '', openingHours: '' })

		// small mapping for common calling codes -> ISO2 abbreviations
		function mapPhoneToIso(code) {
			if (!code) return ''
			const c = String(code).trim()
			const table = { '+49': 'DE', '49': 'DE', '+1': 'US', '1': 'US', '+44': 'GB', '44': 'GB', '+33': 'FR', '33': 'FR', '+34': 'ES', '34': 'ES', '+39': 'IT', '39': 'IT' }
			// try full token
			if (table[c]) return table[c]
			// try extract leading +NN or NN
			const m = c.match(/\+?\d{1,3}/)
			if (m && table[m[0]]) return table[m[0]]
			return ''
		}

		async function loadAd() {
			if (!id) return
			try {
				const res = await fetch(`http://localhost:4000/api/ads/${id}`)
				const data = await res.json()
				if (!res.ok) throw new Error(data.message || 'Failed to load ad')
				const ad = data.ad
				currentAd.value = ad
				// map fields
				images.value = ((ad.details && ad.details.images && ad.details.images.length) ? ad.details.images : (ad.images || [])).map(resolveImageUrl)
				car.value.price = ad.details && ad.details.price ? ad.details.price : (ad.vehicle && ad.vehicle.price ? ad.vehicle.price : '')
				car.value.year = ad.vehicle && (ad.vehicle.regYear || ad.vehicle.year) ? (ad.vehicle.regYear || ad.vehicle.year) : ''
				car.value.make = ad.vehicle?.make || ''
				car.value.model = ad.vehicle?.model || ''
				car.value.category = ad.vehicle?.category || ''
				car.value.headline = ad.details?.title || ''
				car.value.description = ad.details?.description || ''
				car.value.options = ad.equipment?.options || []
				car.value.stats = { power: ad.vehicle?.motorPower ? String(ad.vehicle.motorPower) + ' ' + (ad.vehicle.motorPowerUnit || '') : '' }
				car.value.specs = { engine: ad.vehicle?.cubicCapacity || '', power: ad.vehicle?.motorPower ? String(ad.vehicle.motorPower) : '' }

				// map additional vehicle fields for display
				car.value.mileage = ad.vehicle?.mileage || ad.details?.mileage || ''
				car.value.transmission = ad.vehicle?.transmission || ''
				car.value.fuel = ad.vehicle?.fuel || ''
				car.value.owners = ad.vehicle?.owners || ''
				car.value.driveType = ad.vehicle?.driveType || ''

				// map remaining vehicle fields so template reads them directly
				car.value.cubicCapacity = ad.vehicle?.cubicCapacity || ''
				car.value.motorPower = ad.vehicle?.motorPower || ''
				car.value.motorPowerUnit = ad.vehicle?.motorPowerUnit || ''
				car.value.paddleShifters = typeof ad.vehicle?.paddleShifters !== 'undefined' ? ad.vehicle.paddleShifters : ad.vehicle?.paddleShifters === true
				car.value.particulateFilter = typeof ad.vehicle?.particulateFilter !== 'undefined' ? ad.vehicle.particulateFilter : ad.vehicle?.particulateFilter === true
				car.value.startStop = typeof ad.vehicle?.startStop !== 'undefined' ? ad.vehicle.startStop : ad.vehicle?.startStop === true
				car.value.emissionClass = ad.vehicle?.emissionClass || ad.vehicle?.emission || ''
				car.value.emissionSticker = ad.vehicle?.emissionSticker || ''
				car.value.fuelConsumptionComb = ad.vehicle?.fuelConsumptionComb || ad.vehicle?.fuelConsumptionComb || ''
				car.value.fuelConsumptionUrban = ad.vehicle?.fuelConsumptionUrban || ''
				car.value.fuelConsumptionExtraUrban = ad.vehicle?.fuelConsumptionExtraUrban || ''
				car.value.co2Combined = ad.vehicle?.co2Combined || ''
				car.value.subcategory = ad.vehicle?.subcategory || ''
				car.value.damaged = ad.vehicle?.damaged || ''
				car.value.accidentDamaged = ad.vehicle?.accidentDamaged || ''
				car.value.roadworthy = ad.vehicle?.roadworthy || ''
				car.value.nonSmoking = typeof ad.vehicle?.nonSmoking !== 'undefined' ? ad.vehicle.nonSmoking : ad.vehicle?.nonSmoking === true
				isParked.value = readParkedCars().some(item => String(item?._id || item?.id) === String(ad._id))
				car.value.inspectionMonth = ad.vehicle?.inspectionMonth || ''
				car.value.inspectionYear = ad.vehicle?.inspectionYear || ''
				car.value.inspectionDate = ad.vehicle?.inspectionDate || ''
				car.value.fullServiceHistory = typeof ad.vehicle?.fullServiceHistory !== 'undefined' ? ad.vehicle.fullServiceHistory : ad.vehicle?.fullServiceHistory === true
				car.value.warranty = typeof ad.vehicle?.warranty !== 'undefined' ? ad.vehicle.warranty : ad.vehicle?.warranty === true
				car.value.conditionNotes = ad.vehicle?.conditionNotes || ad.details?.conditionNotes || ''
				car.value.doors = ad.vehicle?.doors || ''
				car.value.seats = ad.vehicle?.seats || ''
				car.value.regMonth = ad.vehicle?.regMonth || ''
				car.value.regYear = ad.vehicle?.regYear || ''

				await loadSimilarCars(ad)

				// build features list from equipment
				const eq = ad.equipment || {}
				const featuresList = []
				if (Array.isArray(car.value.options)) featuresList.push(...car.value.options)
				// common arrays
				if (Array.isArray(eq.safetyFeatures)) featuresList.push(...eq.safetyFeatures)
				if (Array.isArray(eq.infotainmentFeatures)) featuresList.push(...eq.infotainmentFeatures)
				if (Array.isArray(eq.extrasFeatures)) featuresList.push(...eq.extrasFeatures)
				if (Array.isArray(eq.heatedSeats)) featuresList.push(...eq.heatedSeats)
				if (Array.isArray(eq.tires)) featuresList.push(...eq.tires)
				// boolean flags
				if (eq.fullServiceHistory) featuresList.push('Full Service History')
				if (eq.warranty) featuresList.push('Warranty')
				if (eq.tirePressureMonitoring) featuresList.push('TPMS')
				if (eq.trailerCoupling) featuresList.push('Trailer coupling')
				if (eq.keylessCentralLocking) featuresList.push('Keyless central locking')
				if (eq.ambientLighting) featuresList.push('Ambient lighting')
				if (eq.electricWindows) featuresList.push('Electric windows')

				// set seller info from owner/contact
				if (ad.owner || ad.contact) {
					seller.value.name = ad.owner?.username || [ad.contact?.firstName, ad.contact?.lastName].filter(Boolean).join(' ') || 'Seller'
					seller.value.phone = [ad.contact?.countryCode, ad.contact?.phone].filter(Boolean).join(' ') || ad.contact?.phone || ''
					// break out address parts for short formatted address
					seller.value.city = ad.contact?.city || ''
					seller.value.zip = ad.contact?.zip || ad.contact?.postal || ''
					seller.value.country = ad.contact?.country || ''
					// prefer an explicit abbrev if available, otherwise map from calling code
					seller.value.countryAbbrev = ad.contact?.countryCodeAlpha2 || mapPhoneToIso(ad.contact?.countryCode) || mapPhoneToIso(ad.contact?.phone)
					seller.value.location = [seller.value.city, seller.value.country].filter(Boolean).join(', ')

					const addressParts = [
						[ad.contact?.street, ad.contact?.number].filter(Boolean).join(' '),
						ad.contact?.zip,
						seller.value.city,
						seller.value.country
					].filter(Boolean)
					seller.value.address = addressParts.join(', ')
				}

				// expose features to template via ref
				featuresFromAd.value = featuresList
			} catch (err) {
				console.error('Load ad error', err)
			}
		}

		async function fetchAds(params) {
			const response = await fetch(`${apiBaseUrl}/api/ads?${new URLSearchParams(params)}`)
			const data = await response.json()
			if (!response.ok) throw new Error(data.message || 'Failed to load similar cars')
			return Array.isArray(data.ads) ? data.ads : []
		}

		async function loadSimilarCars(ad) {
			const currentPrice = parseNumber(ad?.details?.price || ad?.vehicle?.price)
			const currentMake = String(ad?.vehicle?.make || '').trim()

			if (!currentPrice) {
				similarCars.value = []
				return
			}

			const priceFrom = Math.max(0, Math.round(currentPrice * 0.8))
			const priceTo = Math.max(priceFrom + 1, Math.round(currentPrice * 1.2))
			const baseParams = {
				page: '1',
				limit: '20',
				priceFrom: String(priceFrom),
				priceTo: String(priceTo),
				sort: 'price-asc'
			}

			let matches = []
			try {
				if (currentMake) {
					matches = await fetchAds({ ...baseParams, make: currentMake })
				}
				if (!matches.length) {
					matches = await fetchAds(baseParams)
				}
				if (!matches.length) {
					matches = await fetchAds({ page: '1', limit: '20', sort: 'standard' })
				}
			} catch (err) {
				console.error('Load similar cars error', err)
				matches = []
			}

			const filtered = matches
				.filter(item => item?._id !== ad?._id)
				.map(item => ({
					item,
					delta: Math.abs(parseNumber(item?.details?.price || item?.vehicle?.price) - currentPrice)
				}))
				.sort((a, b) => a.delta - b.delta || new Date(b.item?.createdAt || 0) - new Date(a.item?.createdAt || 0))
				.slice(0, 8)
				.map(entry => mapAdToSwipeCar(entry.item))

			similarCars.value = filtered
		}

			// fallback JS sticky if CSS sticky doesn't behave (some ancestors can prevent sticky)
			const sellerRef = ref(null)
			const isSellerFixed = ref(false)
			const sellerWidth = ref(null)
			const sellerTop = ref(0)
			const sellerHeight = ref(0)
			const similarSectionRef = ref(null)
			const similarTop = ref(null)

			function updateSellerMeasurements() {
				if (!sellerRef.value) return
				const rect = sellerRef.value.getBoundingClientRect()
				sellerWidth.value = rect.width
				sellerHeight.value = rect.height
				sellerTop.value = rect.top + window.scrollY
				if (similarSectionRef.value) {
					const srect = similarSectionRef.value.getBoundingClientRect()
					similarTop.value = srect.top + window.scrollY
				} else {
					similarTop.value = null
				}
			}

			function onScroll() {
				if (!sellerRef.value) return
				if (!isMdOrUp.value) {
					isSellerFixed.value = false
					return
				}
				const topOffset = 24
				const cur = window.scrollY
				if (similarTop.value) {
					// fix if we've scrolled past seller top and we won't overlap similar section
					if (cur >= sellerTop.value - topOffset && (cur + topOffset + sellerHeight.value) < (similarTop.value - 8)) {
						isSellerFixed.value = true
					} else {
						isSellerFixed.value = false
					}
				} else {
					isSellerFixed.value = (cur >= sellerTop.value - topOffset)
				}
			}

			onMounted(() => {
				updateSellerMeasurements()
				window.addEventListener('scroll', onScroll, { passive: true })
				window.addEventListener('resize', updateSellerMeasurements)
			})

			onUnmounted(() => {
				window.removeEventListener('scroll', onScroll)
				window.removeEventListener('resize', updateSellerMeasurements)
			})

			const sellerStyle = computed(() => {
				if (!isSellerFixed.value || !isMdOrUp.value) return {}
				return { position: 'fixed', top: '1.5rem', width: sellerWidth.value ? sellerWidth.value + 'px' : 'auto', zIndex: 40 }
			})

			// Similar cars for swipe section
			const similarRef = ref(null)

			function scrollSimilarBy(amount) {
				if (!similarRef.value) return
				similarRef.value.scrollBy({ left: amount, behavior: 'smooth' })
			}
			function scrollSimilarLeft() { if (similarRef.value) scrollSimilarBy(-Math.round(similarRef.value.clientWidth * 0.7)) }
			function scrollSimilarRight() { if (similarRef.value) scrollSimilarBy(Math.round(similarRef.value.clientWidth * 0.7)) }

			// Description show-more handling
			const description = computed(() => car.value.description || '')
			const descriptionVisibleCount = 600
			const descriptionShowMore = ref(false)
			const visibleDescription = computed(() => descriptionShowMore.value ? description.value : description.value.slice(0, descriptionVisibleCount))
			const descriptionToggleClass = computed(() => theme.value === 'dark' ? 'text-purple-300 hover:underline' : 'text-purple-600 hover:underline')
			function toggleDescriptionShowMore() { descriptionShowMore.value = !descriptionShowMore.value }

		const containerClass = computed(() => theme.value === 'dark' ? 'min-h-screen bg-gray-900 text-gray-100' : 'min-h-screen bg-gray-0 text-gray-900')
		const cardClass = computed(() => theme.value === 'dark' ? 'bg-gray-800 border border-gray-700 rounded-xl' : 'bg-white border border-gray-200 rounded-xl')
		const priceClass = computed(() => theme.value === 'dark' ? 'text-3xl font-bold text-gray-100' : 'text-3xl font-bold text-gray-900')
		const titleClass = computed(() => theme.value === 'dark' ? 'text-xl font-semibold text-gray-100' : 'text-xl font-semibold text-gray-900')
		const statClass = computed(() => (theme.value === 'dark' ? 'bg-gray-900/40 p-4 rounded-lg text-center' : 'bg-white p-4 rounded-lg text-center border border-gray-100'))
		const specCardClass = computed(() => (theme.value === 'dark' ? 'bg-gray-800 p-4 rounded-lg border border-gray-700' : 'bg-white p-4 rounded-lg border border-gray-200'))
		const techCardClass = computed(() => (theme.value === 'dark' ? 'bg-gray-800 p-4 rounded-lg border border-gray-700' : 'bg-white p-4 rounded-lg border border-gray-200'))
		const featuresCardClass = computed(() => (theme.value === 'dark' ? 'bg-gray-800 p-4 rounded-lg border border-gray-700' : 'bg-white p-4 rounded-lg border border-gray-200'))
		const descriptionCardClass = computed(() => (theme.value === 'dark' ? 'bg-gray-800 p-4 rounded-lg border border-gray-700' : 'bg-white p-4 rounded-lg border border-gray-200'))

		const technical = computed(() => ([
			{ label: 'Make', value: car.value.make || '—' },
			{ label: 'Model', value: car.value.model || '—' },
			{ label: 'Year', value: car.value.year || '—' },
			{ label: 'Registration', value: (car.value.regMonth && car.value.regYear) ? `${car.value.regMonth} ${car.value.regYear}` : (car.value.regYear || '—') },
			{ label: 'Mileage', value: car.value.mileage ? `${car.value.mileage} km` : '—' },
			{ label: 'Engine / Capacity', value: car.value.cubicCapacity || car.value.specs?.engine || '—' },
			{ label: 'Power', value: car.value.motorPower ? `${car.value.motorPower}${car.value.motorPowerUnit ? ' ' + car.value.motorPowerUnit : ''}` : ((car.value.stats && car.value.stats.power) || (car.value.specs && car.value.specs.power) || '—') },
			{ label: 'Fuel', value: car.value.fuel || '—' },
			{ label: 'Transmission', value: car.value.transmission || '—' },
			{ label: 'Drive type', value: car.value.driveType || '—' },
			{ label: 'Doors', value: car.value.doors || '—' },
			{ label: 'Seats', value: car.value.seats ? String(car.value.seats) : '—' },
			{ label: 'Emission class', value: car.value.emissionClass || car.value.emission || '—' },
			{ label: 'CO₂ combined', value: car.value.co2Combined ? `${car.value.co2Combined} g/km` : '—' },
			{ label: 'Fuel consumption (combined)', value: car.value.fuelConsumptionComb ? `${car.value.fuelConsumptionComb} l/100km` : '—' },
			{ label: 'Fuel consumption (urban)', value: car.value.fuelConsumptionUrban ? `${car.value.fuelConsumptionUrban} l/100km` : '—' },
			{ label: 'Fuel consumption (extra-urban)', value: car.value.fuelConsumptionExtraUrban ? `${car.value.fuelConsumptionExtraUrban} l/100km` : '—' },
			{ label: 'Start/Stop', value: typeof car.value.startStop === 'boolean' ? (car.value.startStop ? 'Yes' : 'No') : (car.value.startStop || '—') },
			{ label: 'Paddle shifters', value: typeof car.value.paddleShifters === 'boolean' ? (car.value.paddleShifters ? 'Yes' : 'No') : (car.value.paddleShifters || '—') },
			{ label: 'Particulate filter', value: typeof car.value.particulateFilter === 'boolean' ? (car.value.particulateFilter ? 'Yes' : 'No') : (car.value.particulateFilter || '—') },
			{ label: 'Inspection', value: (car.value.inspectionMonth && car.value.inspectionYear) ? `${car.value.inspectionMonth} ${car.value.inspectionYear}` : (car.value.inspectionYear || car.value.inspectionDate || '—') },
			{ label: 'Roadworthy', value: car.value.roadworthy || '—' },
			{ label: 'Condition notes', value: car.value.conditionNotes || '—' },
			{ label: 'Owners', value: car.value.owners || '—' },
			{ label: 'Damaged', value: car.value.damaged || '—' },
			{ label: 'Accident damaged', value: car.value.accidentDamaged || '—' },
			{ label: 'Full service history', value: typeof car.value.fullServiceHistory === 'boolean' ? (car.value.fullServiceHistory ? 'Yes' : 'No') : (car.value.fullServiceHistory || '—') },
			{ label: 'Warranty', value: typeof car.value.warranty === 'boolean' ? (car.value.warranty ? 'Yes' : 'No') : (car.value.warranty || '—') },
			{ label: 'Non-smoking', value: typeof car.value.nonSmoking === 'boolean' ? (car.value.nonSmoking ? 'Yes' : 'No') : (car.value.nonSmoking || '—') },
			{ label: 'Subcategory', value: car.value.subcategory || '—' },
			{ label: 'Category', value: car.value.category || '—' }
		]))

		function rowBg(i) {
			if (i % 2 === 1) return theme.value === 'dark' ? 'bg-gray-900/40' : 'bg-gray-200'
			return ''
		}

		const featuresFromAd = ref([])

		// load ad when component mounts
		onMounted(() => {
			updateSellerMeasurements()
			loadAd()
			window.addEventListener('resize', updateSellerMeasurements)
			window.addEventListener('scroll', onScroll)
		})
		onUnmounted(() => {
			window.removeEventListener('resize', updateSellerMeasurements)
			window.removeEventListener('scroll', onScroll)
		})
		// track whether viewport is md or larger (matches Tailwind 'md' breakpoint)
		const isMdOrUp = ref(false)

		onMounted(() => {
			if (typeof window !== 'undefined' && window.matchMedia) {
				const mq = window.matchMedia('(min-width: 768px)')
				isMdOrUp.value = mq.matches
				const handler = (e) => { isMdOrUp.value = e.matches }
				if (mq.addEventListener) mq.addEventListener('change', handler)
				else mq.addListener(handler)
				onUnmounted(() => {
					if (mq.removeEventListener) mq.removeEventListener('change', handler)
					else mq.removeListener(handler)
				})
			}
		})

		function featuresRowBg(i) {
			const cols = isMdOrUp.value ? 2 : 1
			const rowIndex = Math.floor(i / cols)
			return rowBg(rowIndex)
		}

		const visibleCount = 6
		const showMore = ref(false)
		const visibleTechnical = computed(() => showMore.value ? technical.value : technical.value.slice(0, visibleCount))

		const showMoreClass = computed(() => theme.value === 'dark' ? 'text-purple-300 hover:underline' : 'text-purple-600 hover:underline')

		function toggleShowMore() { showMore.value = !showMore.value }

		// Features card data 
	    const features = computed(() => (featuresFromAd.value.map(f => ({ label: f })) || []))

		const featuresVisibleCount = 8
		const featuresShowMore = ref(false)
		const visibleFeatures = computed(() => featuresShowMore.value ? features.value : features.value.slice(0, featuresVisibleCount))

		const featuresItemClass = computed(() => theme.value === 'dark' ? ' p-3' : ' p-3')
		const featuresCheckClass = computed(() => theme.value === 'dark' ? 'text-gray-100' : 'text-green-600')
		const featuresToggleClass = computed(() => theme.value === 'dark' ? 'text-purple-300 hover:underline' : 'text-purple-600 hover:underline')

		function toggleFeaturesShowMore() { featuresShowMore.value = !featuresShowMore.value }
    const sellerCardClass = computed(() => (theme.value === 'dark' ? 'bg-gray-800 p-4 rounded-lg border border-gray-700' : 'bg-white p-4 rounded-lg border border-gray-200'))
		const navButtonClass = computed(() => theme.value === 'dark' ? 'bg-gray-700/80 text-gray-100 hover:bg-gray-700/90 border border-gray-600' : 'bg-white/90 text-gray-900 hover:bg-white/100 border border-gray-100')

			// phone reveal handling: initially hidden
			const phoneRevealed = ref(false)
			const phoneDisplay = computed(() => {
				const p = seller.value.phone || ''
				if (!p) return '—'
				if (phoneRevealed.value) return p
				return '*'.repeat(p.length)
			})

			function togglePhone() { phoneRevealed.value = !phoneRevealed.value }

			const sellerShortAddress = computed(() => {
				if (seller.value.countryAbbrev && seller.value.zip && seller.value.city) return `${seller.value.countryAbbrev}-${seller.value.zip} ${seller.value.city}`
				if (seller.value.zip && seller.value.city) return `${seller.value.zip} ${seller.value.city}`
				return seller.value.location || seller.value.address || ''
			})

		function goBack() {
			if (window.history.length > 1) router.back()
			else router.push({ name: 'Home' })
		}

				return { images, index, currentImage, next, prev, setIndex, car, seller, theme, containerClass, cardClass, priceClass, titleClass, statClass, specCardClass, techCardClass, featuresCardClass, descriptionCardClass, technical, visibleTechnical, visibleCount, showMore, showMoreClass, toggleShowMore, features, featuresVisibleCount, featuresShowMore, visibleFeatures, featuresItemClass, featuresCheckClass, featuresToggleClass, toggleFeaturesShowMore, sellerCardClass, navButtonClass, rowBg, featuresRowBg, sellerRef, sellerStyle, description, descriptionVisibleCount, descriptionShowMore, visibleDescription, descriptionToggleClass, toggleDescriptionShowMore, similarRef, similarSectionRef, similarCars, scrollSimilarLeft, scrollSimilarRight, goBack, phoneRevealed, phoneDisplay, togglePhone, sellerShortAddress, headlineDisplay, togglePark, isParked }
	}
}
</script>

<style scoped>
.pi { vertical-align: middle }

/* 70/30 layout: single column on small screens */
.layout-70-30 { grid-template-columns: 1fr }
@media (min-width: 1024px) {
	.layout-70-30 { grid-template-columns: 70% 30% }
}

.layout-card { margin-top: 0.5rem }

.card-image-controls button { background: rgba(255,255,255,0.9) }

/* right panel tweaks */
.price-badge { display: inline-flex; gap: 4px }
.price-badge .bar { width: 18px; height: 6px; border-radius: 2px; display: inline-block }
.price-badge .bar.bg-green-300 { opacity: 0.6 }

.sticky .rounded-md { border-radius: 8px }

.layout-70-30 aside img { object-fit: cover }
</style>