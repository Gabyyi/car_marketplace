<template>
  <section class="space-y-6 py-6">
    <article class="relative overflow-hidden rounded-3xl bg-blue-500 px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-3xl font-medium text-white sm:text-4xl">Ready to sell?</h1>
        <p class="mt-3 text-lg leading-snug text-blue-100 sm:text-2xl">
          Post your vehicle in minutes and reach thousands of local buyers.
        </p>

        <button
          type="button"
          @click="handleSell"
          class="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 text-2xl font-medium text-blue-500 shadow-sm transition hover:bg-blue-50"
        >
          <i class="pi pi-plus-circle text-3xl"></i>
          <span>Sell Your Car</span>
        </button>
      </div>

      <i class="pi pi-car absolute -bottom-4 right-3 text-[220px] text-blue-400/40"></i>
    </article>

    <article :class="searchCardClass">
      <h2 :class="searchTitleClass">General Search</h2>

      <div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label :class="labelClass">Make</label>
          <select :class="formSelectClass">
            <option>Any make</option>
            <option>BMW</option>
            <option>Audi</option>
            <option>Mercedes-Benz</option>
          </select>
        </div>

        <div>
          <label :class="labelClass">Model</label>
          <select :class="formSelectClass">
            <option>Any model</option>
            <option>Series 3</option>
            <option>A4</option>
            <option>C-Class</option>
          </select>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label :class="labelClass">Price Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select :class="formSelectClass">
              <option>Min</option>
              <option>€1,000</option>
              <option>€5,000</option>
              <option>€10,000</option>
              <option>€20,000</option>
            </select>
            <select :class="formSelectClass">
              <option>Max</option>
              <option>€10,000</option>
              <option>€20,000</option>
              <option>€30,000</option>
              <option>€50,000+</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label :class="labelClass">Year Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select :class="formSelectClass">
              <option>From</option>
              <option>2005</option>
              <option>2010</option>
              <option>2015</option>
              <option>2020</option>
            </select>
            <select :class="formSelectClass">
              <option>To</option>
              <option>2015</option>
              <option>2018</option>
              <option>2022</option>
              <option>2026</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label :class="labelClass">Kilometers Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select :class="formSelectClass">
              <option>Min</option>
              <option>0 km</option>
              <option>25,000 km</option>
              <option>50,000 km</option>
              <option>100,000 km</option>
            </select>
            <select :class="formSelectClass">
              <option>Max</option>
              <option>50,000 km</option>
              <option>100,000 km</option>
              <option>150,000 km</option>
              <option>200,000+ km</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label class="mb-2 mt-6 block text-sm font-medium text-gray-700"></label>
          <div class="grid grid-cols-1 gap-2">
            <button
              type="button"
              @click="$router.push('/search')"
              class="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-blue-500 px-10 py-2 text-lg font-medium text-white transition hover:bg-blue-600 sm:w-auto"
            >
              <i class="pi pi-search text-lg"></i>
              <span>Search</span>
            </button>
          </div>
        </div>

      </div>

        <div class="mt-3 flex items-center justify-center gap-10 md:justify-end md:gap-8">
          <a href="#" class="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline">
            <i class="pi pi-refresh"></i>
            <span>Reset</span>
          </a>
          <a href="#" class="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline">
            <i class="pi pi-sliders-h"></i>
            <span>More filters</span>
          </a>
        </div>
    </article>

    <MainCarAdCard />
    <CarAdCard />

    <article :class="searchCardClass">
      <h2 :class="topDealsTitleClass">Top deals for you</h2>
      <div class="mt-4 relative">
        <div ref="swipeContainer" class="-mx-3 flex gap-4 overflow-x-auto px-3 py-2 snap-x snap-mandatory touch-pan-x">
          <SwipeCar v-for="(c, idx) in swipeCars" :key="c.id || idx" :car="c" />
        </div>

        <div class="absolute right-2 top-1/2 hidden -translate-y-1/2 md:block">
          <button @click="scrollNext" :class="arrowBtnClass">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
        <div class="absolute left-2 top-1/2 hidden -translate-y-1/2 md:block">
          <button @click="scrollPrev" :class="arrowBtnClass">
            <i class="pi pi-chevron-left"></i>
          </button>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainCarAdCard from '../components/MainCarAdCard.vue'
import SwipeCar from '../components/SwipeCar.vue'
import { useTheme } from '../composables/useTheme'

export default {
  name: 'HomePage',
  components: { MainCarAdCard, SwipeCar },
  setup() {
    const router = useRouter()
    const swipeContainer = ref(null)
    const { theme } = useTheme()
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const swipeCars = ref([])

    function resolveImageUrl(url) {
      if (!url) return ''
      if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
      if (url.startsWith('/uploads/')) return `${apiBaseUrl}${url}`
      return url
    }

    function mapAdToSwipeCar(ad) {
      const images = Array.isArray(ad?.details?.images) && ad.details.images.length ? ad.details.images : (ad?.images || [])
      return {
        id: ad?._id || '',
        image: resolveImageUrl(images[0]),
        make: ad?.vehicle?.make || 'Car',
        model: ad?.vehicle?.model || 'Ad',
        price: ad?.details?.price || ad?.vehicle?.price || '0',
        fuelType: ad?.vehicle?.fuel || '',
        gearbox: ad?.vehicle?.transmission || '',
        power: ad?.vehicle?.motorPower ? `${ad.vehicle.motorPower}${ad?.vehicle?.motorPowerUnit ? ad.vehicle.motorPowerUnit : ''}` : '',
        kilometers: ad?.vehicle?.mileage ? `${new Intl.NumberFormat('en-US').format(Number(ad.vehicle.mileage))} km` : '',
        year: [ad?.vehicle?.regMonth, ad?.vehicle?.regYear].filter(Boolean).join(' ') || ad?.vehicle?.year || '',
        location: [ad?.contact?.city, ad?.contact?.country].filter(Boolean).join(', ') || ''
      }
    }

    async function loadSwipeCars() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/ads/random-list?limit=5`)
        if (!response.ok) return
        const data = await response.json()
        swipeCars.value = (data.ads || []).map(mapAdToSwipeCar)
      } catch (error) {
        console.error('Failed to load swipe cars', error)
      }
    }

    onMounted(() => {
      loadSwipeCars()
    })

    function scrollNext() {
      if (!swipeContainer.value) return
      swipeContainer.value.scrollBy({ left: swipeContainer.value.clientWidth * 0.7, behavior: 'smooth' })
    }

    function scrollPrev() {
      if (!swipeContainer.value) return
      swipeContainer.value.scrollBy({ left: -swipeContainer.value.clientWidth * 0.7, behavior: 'smooth' })
    }

    function handleSell() {
      const token = localStorage.getItem('token')
      if (token) {
        router.push({ name: 'PostAd' })
      } else {
        router.push({ name: 'Login' })
      }
    }

    const searchCardClass = computed(() => ['rounded-3xl', 'p-5', 'shadow-sm', 'sm:p-6', 'md:p-8', theme.value === 'dark' ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'].join(' '))
    const searchTitleClass = computed(() => ['text-xl', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
    const topDealsTitleClass = computed(() => ['text-3xl', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
    const arrowBtnClass = computed(() => ['rounded-full', 'p-2', 'transition', theme.value === 'dark' ? 'bg-gray-800 border border-gray-700 shadow-md text-gray-200 hover:bg-gray-700' : 'bg-white/90 border border-gray-200 shadow-md hover:bg-white'].join(' '))
    const labelClass = computed(() => ['mb-2', 'block', 'text-sm', 'font-medium', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700'].join(' '))
    const formSelectClass = computed(() => ['w-full', 'rounded-lg', 'border', 'px-3', 'py-2', 'text-sm', 'focus:border-blue-500', 'focus:outline-none', theme.value === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300 bg-white text-gray-700'].join(' '))

    return { swipeContainer, swipeCars, scrollNext, scrollPrev, searchCardClass, searchTitleClass, topDealsTitleClass, arrowBtnClass, labelClass, formSelectClass, handleSell }
  }
}
</script>
