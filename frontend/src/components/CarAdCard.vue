<template>
	<article :class="cardClasses" @click="openCar">
		<div class="flex flex-col md:flex-row">
			<!-- Left: Images (4:3 main + thumbnails) -->
			<div class="w-full p-3 md:w-2/5">
				<div :class="imageWrapperClass">
					<img :src="displayImages[0]" :alt="`${displayMake} ${displayModel}`" class="h-full w-full object-cover object-center" />
				</div>
				<div class="grid grid-cols-3 gap-3">
					<div v-for="(img, idx) in displayImages.slice(0,3)" :key="idx" class="aspect-4/3 overflow-hidden rounded-b-md">
						<img :src="img" class="h-full w-full object-cover object-center" :alt="`thumb-${idx}`" />
					</div>
				</div>

				<!-- Desktop: show location under thumbnails -->
				<div class="pt-6 pb-3 text-sm text-gray-400 hidden md:block">{{ location }}</div>
			</div>

			<!-- Right: Details -->
			<div class="w-full p-4 md:w-3/5 md:flex md:flex-col">
				<h3 :class="titleClass">{{ displayMake }} {{ displayModel }}</h3>
				<p class="mt-1 text-sm" :class="descClass">{{ displaySubtitle }}</p>

				<div class="mt-4 flex items-baseline gap-4">
					<p :class="priceClass">€{{ displayPrice }}</p>
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-1">
							<div v-for="n in 5" :key="n" :class="['w-4 h-2 rounded', n <= filledBars ? 'bg-emerald-600' : unfilledBarClass]"></div>
						</div>
						<span class="text-sm font-medium" :class="descClass">{{ displayValueRatingText }}</span>
					</div>
				</div>

				<p class="mt-2 text-sm text-gray-400">{{ displayNegotiable ? 'Negotiable' : '' }}</p>

				<p class="mt-4 font-semibold" :class="descClass">{{ displayHighlight }}</p>

				<div class="mt-3 text-sm" :class="metaClass">
					<span>{{ displayRegistration }} • {{ displayKilometers }}km • {{ displayPower }}hp • {{ displayFuelType }}</span>
				</div>

				<div class="mt-auto w-full">
					<div class="flex flex-col md:flex-row md:items-center md:justify-end gap-3">
						<!-- Mobile: show location below buttons; hide on md+ where left-column location is used -->
						<div class="text-sm text-gray-400 order-2 md:order-1 md:hidden">{{ displayLocation }}</div>

						<div class="pt-3 order-1 md:order-2 flex w-full gap-3 md:w-auto md:justify-end md:self-end">
							<button type="button" class="w-1/2 md:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition">
								<i class="pi pi-envelope"></i>
								<span>Contact</span>
							</button>

							<button type="button" :class="[parkBtnClass, 'w-1/2 md:w-auto inline-flex items-center justify-center']">
								<i class="pi pi-heart"></i>
								<span>Park</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useRouter } from 'vue-router'

const props = defineProps({
	images: { type: Array, default: () => [
		'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1603376279260-3d7f3f3b9b2a?auto=format&fit=crop&w=800&q=60',
		'https://images.unsplash.com/photo-1542367597-701c9b7b0b2f?auto=format&fit=crop&w=800&q=60'
	] },
	make: { type: String, default: 'Volkswagen' },
	model: { type: String, default: 'ID.3' },
	subtitle: { type: String, default: 'Pro 58 kWh 150 kW Pro Pro' },
	price: { type: String, default: '24,500' },
	valueRatingPercent: { type: Number, default: 80 },
	valueRatingText: { type: String, default: 'Very good price' },
	negotiable: { type: Boolean, default: true },
	highlight: { type: String, default: 'Repaired accident damage' },
	registration: { type: String, default: 'FR 05/2024' },
	kilometers: { type: String, default: '19,350 km' },
	power: { type: String, default: '150 kW (204 hp)' },
	fuelType: { type: String, default: 'Electric' },
	location: { type: String, default: 'LT-14189 Vilnius, Private Seller' }
    ,
    ad: { type: Object, default: () => ({}) }
})

const { theme } = useTheme()

const displayImages = computed(() => (props.ad && props.ad.images && props.ad.images.length) ? props.ad.images : props.images)
const displayMake = computed(() => props.ad && props.ad.make ? props.ad.make : props.make)
const displayModel = computed(() => props.ad && props.ad.model ? props.ad.model : props.model)
const displaySubtitle = computed(() => props.ad && props.ad.subtitle ? props.ad.subtitle : props.subtitle)
const displayPrice = computed(() => props.ad && (props.ad.price !== undefined) ? props.ad.price : props.price)
const displayValueRatingPercent = computed(() => (props.ad && (props.ad.priceScore !== undefined)) ? props.ad.priceScore : props.valueRatingPercent)
const displayValueRatingText = computed(() => props.ad && props.ad.valueRatingText ? props.ad.valueRatingText : props.valueRatingText)
const displayNegotiable = computed(() => (props.ad && (props.ad.negotiable !== undefined)) ? props.ad.negotiable : props.negotiable)
const displayHighlight = computed(() => props.ad && props.ad.highlight ? props.ad.highlight : props.highlight)
const displayRegistration = computed(() => props.ad && props.ad.registration ? props.ad.registration : props.registration)
const displayKilometers = computed(() => (props.ad && (props.ad.km !== undefined)) ? props.ad.km : props.kilometers)
const displayPower = computed(() => props.ad && props.ad.power ? props.ad.power : props.power)
const displayFuelType = computed(() => props.ad && props.ad.fuelType ? props.ad.fuelType : props.fuelType)
const displayLocation = computed(() => props.ad && props.ad.location ? props.ad.location : props.location)

const cardClasses = computed(() => [
	'overflow-hidden', 'rounded-2xl', 'shadow-sm', 'cursor-pointer',
	theme.value === 'dark' ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'
].join(' '))

const imageWrapperClass = computed(() => ['aspect-4/3', 'overflow-hidden', 'rounded-t-md', theme.value === 'dark' ? 'bg-gray-800' : 'bg-gray-100'].join(' '))
const titleClass = computed(() => ['text-md', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const descClass = computed(() => ['text-sm', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-600'].join(' '))
const priceClass = computed(() => ['text-xl', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const metaClass = computed(() => theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700')
const parkBtnClass = computed(() => ['inline-flex', 'items-center', 'gap-2', 'rounded-lg', 'px-4', 'py-2', 'text-sm', 'font-medium', 'transition', theme.value === 'dark' ? 'border border-gray-600 text-gray-200 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'].join(' '))

const filledBars = computed(() => {
	const pct = Math.max(0, Math.min(100, Number(displayValueRatingPercent.value || 0)))
	return Math.max(0, Math.min(5, Math.round(pct / 20)))
})

const unfilledBarClass = computed(() => theme.value === 'dark' ? 'bg-gray-700' : 'bg-gray-300')

const router = useRouter()
function openCar() {
	router.push({ name: 'CarAd' })
}
</script>

<style scoped>
.aspect-4\/3 { /* fallback if Tailwind aspect isn't available */
	position: relative;
	padding-top: 75%;
}
.aspect-4\/3 > img {
	position: absolute;
	top: 0; left: 0; width: 100%; height: 100%;
}
</style>
