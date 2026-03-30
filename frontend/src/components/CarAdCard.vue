<template>
  <article :class="cardClasses">
    <div class="flex flex-col md:flex-row">
        <div class="w-full p-3 md:w-2/3 md:p-4">
        <div :class="imageWrapperClass">
          <img
            :src="imageUrl"
            :alt="`${make} ${model}`"
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <div class="w-full p-4 md:w-1/3 md:flex md:flex-col">
        <h3 :class="titleClass">{{ make }} {{ model }}</h3>
        <p :class="descClass">{{ description }}</p>

        <div class="mt-4">
          <p :class="priceClass">€{{ price }}</p>
          <p class="mt-1 text-sm font-medium text-emerald-700"> {{ valueRating }} </p>
        </div>

        <div class="mt-4 flex flex-wrap items-center text-sm" :class="metaClass">
          <span>{{ tag }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span>{{ country }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span>{{ registrationDate }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span>{{ kilometers }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span>{{ power }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span>{{ fuelType }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span>{{ fuelConsumption }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span>{{ pollution }}</span>
        </div>

        <div class="mt-4 inline-flex items-center gap-2 text-sm" :class="metaClass">
          <i class="pi pi-check text-blue-600"></i>
          <span>{{ gearbox }}</span>
        </div>

        <div class="mt-4 inline-flex items-center gap-2 text-sm" :class="metaClass">
          <i class="pi pi-map-marker text-blue-600"></i>
          <span>{{ location }}</span>
        </div>

        <!-- Dealer block: always show (4:3 logo). On mobile: dealer info and buttons share a row; rating stacks under name. On md+: rating follows name inline. -->
        <div class="mt-4">
          <div class="flex items-center justify-between md:flex-col md:items-start">
            <!-- Dealer info -->
            <div class="flex items-center gap-3">
              <div class="w-20 shrink-0">
                <div :class="dealerImgClass">
                  <img :src="displayedDealer.picture" :alt="displayedDealer.name" class="h-full w-full object-cover object-center" />
                </div>
              </div>

              <div class="flex flex-col">
                <div class="flex flex-col md:flex-row md:items-center md:gap-2">
                  <div :class="dealerNameClass">{{ displayedDealer.name }}</div>
                  <div class="mt-1 md:mt-0 md:ml-1 flex items-center text-yellow-400">
                    <i v-for="n in starArray(displayedDealer.rating)" :key="n + '-' + displayedDealer.name" class="pi pi-star mr-0.5" />
                  </div>
                </div>
                <div :class="dealerLocationClass">{{ displayedDealer.postalCode }} {{ displayedDealer.city }}</div>
              </div>
            </div>

            <!-- Action buttons: on mobile they sit on same row (parent is row), on md+ they move below and align end -->
            <div class="ml-2 flex gap-2 md:ml-0 md:mt-8 md:self-end">
              <button type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition">
                <i class="pi pi-phone"></i>
                <span>Contact</span>
              </button>
              <button type="button" :class="parkBtnClass">
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

const props = defineProps({
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
  make: { type: String, default: 'BMW' },
  model: { type: String, default: 'M4 Competition' },
  description: { type: String, default: 'Full service history, M Driver Package, carbon exterior package.' },
  price: { type: String, default: '78,900' },
  valueRating: { type: String, default: 'Great Value' },
  tag: { type: String, default: 'Accident-free' },
  fuelType: { type: String, default: 'Petrol' },
  fuelConsumption: { type: String, default: '5.8l/100km' },
  pollution: { type: String, default: '131g CO2/km' },
  country: { type: String, default: 'RO' },
  registrationDate: { type: String, default: '09/2023' },
  kilometers: { type: String, default: '21,400 km' },
  power: { type: String, default: '375kW (510hp)' },
  gearbox: { type: String, default: 'Automatic' },
  location: { type: String, default: 'Bucharest, RO' },
  dealer: { type: Object, default: null }
})

const { theme } = useTheme()

const cardClasses = computed(() => [
  'overflow-hidden', 'rounded-2xl', 'shadow-sm',
  theme.value === 'dark' ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'
].join(' '))

const imageWrapperClass = computed(() => ['aspect-4/3', 'overflow-hidden', 'rounded-xl', theme.value === 'dark' ? 'bg-gray-800' : 'bg-gray-100'].join(' '))

const titleClass = computed(() => ['text-2xl', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const descClass = computed(() => ['mt-1', 'truncate', 'text-sm', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-600'].join(' '))
const priceClass = computed(() => ['text-3xl', 'font-semibold', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const metaClass = computed(() => theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700')
const dealerImgClass = computed(() => ['aspect-4/3', 'overflow-hidden', 'rounded-md', theme.value === 'dark' ? 'bg-gray-800' : 'bg-gray-100'].join(' '))
const dealerNameClass = computed(() => theme.value === 'dark' ? 'font-medium text-gray-100' : 'font-medium text-gray-900')
const dealerLocationClass = computed(() => theme.value === 'dark' ? 'mt-1 text-sm text-gray-400' : 'mt-1 text-sm text-gray-500')
const parkBtnClass = computed(() => ['inline-flex', 'items-center', 'gap-2', 'rounded-lg', 'px-4', 'py-2', 'text-sm', 'font-medium', 'transition', theme.value === 'dark' ? 'border border-gray-600 text-gray-200 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'].join(' '))

const defaultDealer = {
  picture: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=160&q=80',
  name: 'Demo Dealer',
  rating: 4,
  postalCode: '01001',
  city: 'Bucharest'
}

const displayedDealer = computed(() => Object.assign({}, defaultDealer, props.dealer || {}))

function starArray(rating) {
  return Math.max(0, Math.round(rating || 0))
}
</script>