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
									<div v-for="(thumb, idx) in images" :key="idx" class="w-20 h-12 rounded-md overflow-hidden flex-shrink-0 cursor-pointer" :class="idx === index ? 'ring-2 ring-blue-500' : 'ring-0'" @click="setIndex(idx)">
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

								<div class="mt-1 text-sm text-gray-400">{{ car.year }} • {{ car.category }}</div>
							</div>

							<!-- financing -->
							<div class="text-sm text-gray-400">
								from <span class="font-medium">$650</span>/mo · <a href="#" class="text-blue-500">Calculate financing</a>
							</div>

							<div class="border-t pt-3"></div>

							<!-- seller/company -->
							<div>
								<div class="text-sm text-gray-400">Automobile Jersch <span class="text-yellow-400">★★★★★</span></div>
								<div class="mt-1 text-sm text-gray-400">DE-44269 Dortmund</div>
							</div>

							<!-- phone -->
							<div class="flex items-center justify-between">
								<div class="text-sm text-gray-400">Phone: <span class="font-medium">+49 (0) ...</span></div>
								<button class="text-sm text-blue-500">Show</button>
							</div>

							<!-- CTA buttons -->
							<div class="space-y-2">
								<button class="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 bg-blue-500 text-white shadow">
									<i class="pi pi-envelope"></i>
									<span>Write Email</span>
								</button>

								<div class="flex gap-2">
									<button class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 border-2 border-purple-600 text-purple-600">
										<i class="pi pi-heart"></i>
										<span>Park</span>
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
									<div class="font-medium">42,000 km</div>
									<div class="text-xs text-gray-400">Mileage</div>
								</div>
							</div>

							<!-- Item 2: Transmission (mobile: row1 col2, md: col1 row2) -->
							<div class="flex items-center gap-3" md:class="md:col-start-1 md:row-start-2">
								<i class="pi pi-cog text-lg"></i>
								<div>
									<div class="font-medium">Automatic</div>
									<div class="text-xs text-gray-400">Transmission</div>
								</div>
							</div>

							<!-- Item 3: Power (mobile: row2 col1, md: col2 row1) -->
							<div class="flex items-center gap-3" md:class="md:col-start-2 md:row-start-1">
								<i class="pi pi-bolt text-lg"></i>
								<div>
									<div class="font-medium">450 hp</div>
									<div class="text-xs text-gray-400">Power</div>
								</div>
							</div>

							<!-- Item 4: First registration (mobile: row2 col2, md: col2 row2) -->
							<div class="flex items-center gap-3" md:class="md:col-start-2 md:row-start-2">
								<i class="pi pi-calendar text-lg"></i>
								<div>
									<div class="font-medium">03/2023</div>
									<div class="text-xs text-gray-400">First registration</div>
								</div>
							</div>

							<!-- Item 5: Fuel (mobile: row3 col1, md: col3 row1) -->
							<div class="flex items-center gap-3" md:class="md:col-start-3 md:row-start-1">
								<i class="pi pi-shop text-lg"></i>
								<div>
									<div class="font-medium">Electric</div>
									<div class="text-xs text-gray-400">Fuel</div>
								</div>
							</div>

							<!-- Item 6: Previous owners (mobile: row3 col2, md: col3 row2) -->
							<div class="flex items-center gap-3" md:class="md:col-start-3 md:row-start-2">
								<i class="pi pi-users text-lg"></i>
								<div>
									<div class="font-medium">1 owner</div>
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
									<div class="text-right">
										<div class="text-sm font-semibold text-yellow-400">★ {{ seller.rating }}</div>
										<div class="text-xs text-gray-400">({{ seller.reviewsCount }} reviews)</div>
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
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import SwipeCar from '../components/SwipeCar.vue'

export default {
	name: 'CarAdPage',
 	components: { SwipeCar },
	setup() {
		const { theme } = useTheme()
		const router = useRouter()

		const images = [
			'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80'
		]
		const index = ref(0)
		const currentImage = computed(() => images[index.value])

		function next() { index.value = (index.value + 1) % images.length }
		function prev() { index.value = (index.value - 1 + images.length) % images.length }
		function setIndex(i) { index.value = i }

		const car = {
			price: '42,990',
			year: 2023,
			make: 'Volkswagen',
			model: 'ID.3 Pro',
			category: 'InStock',
			description: `This vehicle offers a dual-motor all-wheel drive system, giving you incredible control in all weather conditions. It features a minimalist interior with a 15-inch touchscreen, premium audio system, and a tinted glass roof.

This particular example has been meticulously cared for and maintained by a single private owner since new. The battery health has been regularly checked and the car has only seen premium servicing at authorized centers. Mechanically, it performs like new — delivering smooth, immediate torque from the electric motors and a refined ride that balances comfort with engaging dynamics. The adaptive suspension and regenerative braking are tuned for responsive handling and efficient energy recovery.

Inside, the cabin is spacious and thoughtfully appointed. Soft-touch surfaces, premium upholstery, and an ergonomic driver’s position make long journeys comfortable. The large central display provides intuitive access to navigation, vehicle settings, and multimedia, while Apple CarPlay and Android Auto keep your phone seamlessly integrated. Ambient lighting, dual-zone climate control, and heated front seats add to the overall refinement.

Safety is comprehensive: multiple airbags, stability control, lane-keeping assist, automated emergency braking, and adaptive cruise control are all included. Parking is made easy with front and rear sensors plus a camera system with multiple viewing angles. The car also benefits from over-the-air updates that keep the software current and unlock improvements over time.

The exterior finish shows minimal signs of wear — a few light micro-scratches consistent with careful urban and highway use, but no structural damage or accidents. Cosmetic details such as the alloy wheels and LED headlights are in excellent condition. Recent consumables (wipers, cabin filter) have been replaced, and the car comes with the original documentation, two keys, and a complete service history.

This vehicle is ideal for buyers who want a technologically advanced, efficient, and practical daily driver without compromising on performance. Whether you commute, take long weekend trips, or want a reliable family car, this model delivers an impressive blend of range, comfort, and modern features. If you'd like, we can arrange a full inspection, a test drive, and provide additional photographs upon request.`,
			options: ['Electric', 'All-Wheel Drive', 'InStock', 'Heated Seats', 'Autopilot'],
			stats: { accel: '3.1s', range: '315 mi', power: '450 hp' },
			specs: { engine: 'N/A (Electric)', power: '450 hp / 335 kW', torque: '639 Nm', consumption: '15.0 kWh/100km' }
		}

			const seller = {
				name: 'Alex Thompson',
				avatar: 'https://i.pravatar.cc/100?img=12',
				location: 'Palo Alto, CA',
				since: 2015,
				carsSold: 240,
				rating: 4.8,
				reviewsCount: 124,
				phone: '+1-650-555-0123',
				website: 'https://automobile-jersch.example.com',
				address: '123 Main St, Palo Alto, CA',
				openingHours: 'Mon-Fri 09:00–18:00'
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
			const similarCars = [
				{ image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', make: 'Audi', model: 'A4', price: '29,500', year: '2019', kilometers: '48,000 km', power: '190hp', gearbox: 'Automatic', fuelType: 'Petrol', location: 'Munich' },
				{ image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80', make: 'BMW', model: '320i', price: '32,000', year: '2020', kilometers: '30,000 km', power: '180hp', gearbox: 'Automatic', fuelType: 'Petrol', location: 'Berlin' },
				{ image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80', make: 'Mercedes', model: 'C180', price: '31,200', year: '2018', kilometers: '60,000 km', power: '156hp', gearbox: 'Automatic', fuelType: 'Petrol', location: 'Hamburg' },
				{ image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80', make: 'Volkswagen', model: 'Golf', price: '18,900', year: '2017', kilometers: '80,000 km', power: '110hp', gearbox: 'Manual', fuelType: 'Diesel', location: 'Frankfurt' }
			]

			function scrollSimilarBy(amount) {
				if (!similarRef.value) return
				similarRef.value.scrollBy({ left: amount, behavior: 'smooth' })
			}
			function scrollSimilarLeft() { if (similarRef.value) scrollSimilarBy(-Math.round(similarRef.value.clientWidth * 0.7)) }
			function scrollSimilarRight() { if (similarRef.value) scrollSimilarBy(Math.round(similarRef.value.clientWidth * 0.7)) }

			// Description show-more handling
			const description = computed(() => car.description)
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
			{ label: 'Vehicle condition', value: 'Used vehicle, Accident-free' },
			{ label: 'Category', value: car.category || 'Saloon' },
			{ label: 'Model range', value: 'E11/E12' },
			{ label: 'Trim line', value: 'Pure 125 kW Goal' },
			{ label: 'Origin', value: 'German edition' },
			{ label: 'Mileage', value: '42,000 km' },
			{ label: 'Power', value: car.stats?.power || car.specs?.power || '—' },
			{ label: 'Transmission', value: 'Automatic' },
			{ label: 'First registration', value: '03/2023' },
			{ label: 'Previous owners', value: '1 owner' }
		]))

		function rowBg(i) {
			if (i % 2 === 1) return theme.value === 'dark' ? 'bg-gray-900/40' : 'bg-gray-200'
			return ''
		}

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
    const features = computed(() => ([
			{ label: 'ABS' }, 
      { label: 'Adaptive lighting' }, 
      { label: 'Alloy wheels' }, 
      { label: 'Apple CarPlay' }, 
      { label: 'Autom. dimming interior mirror' }, 
      { label: 'Central locking' },
			{ label: 'Adaptive Cruise Control' }, 
      { label: 'Alarm system' }, 
      { label: 'Android Auto' }, 
      { label: 'Arm rest' }, 
      { label: 'Bluetooth' }, 
      { label: 'DAB radio' }
		]))

		const featuresVisibleCount = 8
		const featuresShowMore = ref(false)
		const visibleFeatures = computed(() => featuresShowMore.value ? features.value : features.value.slice(0, featuresVisibleCount))

		const featuresItemClass = computed(() => theme.value === 'dark' ? ' p-3' : ' p-3')
		const featuresCheckClass = computed(() => theme.value === 'dark' ? 'text-gray-100' : 'text-green-600')
		const featuresToggleClass = computed(() => theme.value === 'dark' ? 'text-purple-300 hover:underline' : 'text-purple-600 hover:underline')

		function toggleFeaturesShowMore() { featuresShowMore.value = !featuresShowMore.value }
    const sellerCardClass = computed(() => (theme.value === 'dark' ? 'bg-gray-800 p-4 rounded-lg border border-gray-700' : 'bg-white p-4 rounded-lg border border-gray-200'))
		const navButtonClass = computed(() => theme.value === 'dark' ? 'bg-gray-700/80 text-gray-100 hover:bg-gray-700/90 border border-gray-600' : 'bg-white/90 text-gray-900 hover:bg-white/100 border border-gray-100')

		function goBack() {
			if (window.history.length > 1) router.back()
			else router.push({ name: 'Home' })
		}

			return { images, index, currentImage, next, prev, setIndex, car, seller, theme, containerClass, cardClass, priceClass, titleClass, statClass, specCardClass, techCardClass, featuresCardClass, descriptionCardClass, technical, visibleTechnical, visibleCount, showMore, showMoreClass, toggleShowMore, features, featuresVisibleCount, featuresShowMore, visibleFeatures, featuresItemClass, featuresCheckClass, featuresToggleClass, toggleFeaturesShowMore, sellerCardClass, navButtonClass, rowBg, featuresRowBg, sellerRef, sellerStyle, description, descriptionVisibleCount, descriptionShowMore, visibleDescription, descriptionToggleClass, toggleDescriptionShowMore, similarRef, similarSectionRef, similarCars, scrollSimilarLeft, scrollSimilarRight, goBack }
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