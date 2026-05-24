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
          <select v-model="filters.make" :class="formSelectClass">
            <option value="">Any make</option>
            <option v-for="make in availableMakes" :key="make" :value="make">
              {{ make }}
            </option>
          </select>
        </div>

        <div>
          <label :class="labelClass">Model</label>
          <select v-model="filters.model" :class="formSelectClass" :disabled="!filters.make">
            <option value="">Any model</option>
            <option v-for="model in availableModels" :key="model" :value="model">
              {{ model }}
            </option>
          </select>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label :class="labelClass">Price Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select v-model="filters.priceMin" :class="formSelectClass">
              <option value="">Min</option>
              <option value="500">€500</option>
              <option value="1000">€1,000</option>
              <option value="2500">€2,500</option>
              <option value="5000">€5,000</option>
              <option value="10000">€10,000</option>
              <option value="15000">€15,000</option>
              <option value="20000">€20,000</option>
            </select>
            <select v-model="filters.priceMax" :class="formSelectClass">
              <option value="">Max</option>
              <option value="5000">€5,000</option>
              <option value="10000">€10,000</option>
              <option value="15000">€15,000</option>
              <option value="20000">€20,000</option>
              <option value="30000">€30,000</option>
              <option value="50000">€50,000</option>
              <option value="100000">€100,000+</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label :class="labelClass">Year Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select v-model="filters.yearFrom" :class="formSelectClass">
              <option value="">From</option>
              <option value="2000">2000</option>
              <option value="2005">2005</option>
              <option value="2010">2010</option>
              <option value="2015">2015</option>
              <option value="2018">2018</option>
              <option value="2020">2020</option>
              <option value="2022">2022</option>
              <option value="2024">2024</option>
            </select>
            <select v-model="filters.yearTo" :class="formSelectClass">
              <option value="">To</option>
              <option value="2015">2015</option>
              <option value="2018">2018</option>
              <option value="2020">2020</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label :class="labelClass">Kilometers Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select v-model="filters.kmMin" :class="formSelectClass">
              <option value="">Min</option>
              <option value="0">0 km</option>
              <option value="10000">10,000 km</option>
              <option value="25000">25,000 km</option>
              <option value="50000">50,000 km</option>
              <option value="75000">75,000 km</option>
              <option value="100000">100,000 km</option>
              <option value="150000">150,000 km</option>
            </select>
            <select v-model="filters.kmMax" :class="formSelectClass">
              <option value="">Max</option>
              <option value="25000">25,000 km</option>
              <option value="50000">50,000 km</option>
              <option value="75000">75,000 km</option>
              <option value="100000">100,000 km</option>
              <option value="150000">150,000 km</option>
              <option value="200000">200,000 km</option>
              <option value="300000">300,000+ km</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label class="mb-2 mt-6 block text-sm font-medium text-gray-700"></label>
          <div class="grid grid-cols-1 gap-2">
            <button
              type="button"
              @click="handleSearch"
              class="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-blue-500 px-10 py-2 text-lg font-medium text-white transition hover:bg-blue-600 sm:w-auto"
            >
              <i class="pi pi-search text-lg"></i>
              <span>Search</span>
            </button>
          </div>
        </div>

      </div>

        <div class="mt-3 flex items-center justify-center gap-10 md:justify-end md:gap-8">
          <button @click="resetSearchFilters" type="button" class="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline">
            <i class="pi pi-refresh"></i>
            <span>Reset</span>
          </button>
          <button @click="handleMoreFilters" type="button" class="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline">
            <i class="pi pi-sliders-h"></i>
            <span>More filters</span>
          </button>
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

    // Car makes and models
    const carMakes = {
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'i3', 'M440i', 'Z4'],
      'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'RS6'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'A-Class'],
      'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'T-Roc', 'Polo', 'Arteon'],
      'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Edge', 'Mustang'],
      'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Yaris', 'Prius'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Ridgeline', 'Odyssey'],
      'Hyundai': ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'i30', 'Kona'],
      'Skoda': ['Octavia', 'Superb', 'Fabia', 'Rapid', 'Karoq', 'Kodiaq'],
      'Renault': ['Clio', 'Megane', 'Scenic', 'Kadjar', 'Captur', 'Duster']
    }

    // Filters state
    const filters = ref({
      make: '',
      model: '',
      priceMin: '',
      priceMax: '',
      yearFrom: '',
      yearTo: '',
      kmMin: '',
      kmMax: ''
    })

    // Available makes
    const availableMakes = computed(() => Object.keys(carMakes).sort())

    // Available models based on selected make
    const availableModels = computed(() => {
      if (!filters.value.make) return []
      return carMakes[filters.value.make] || []
    })

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

    function handleSearch() {
      const query = buildSearchQuery()
      router.push({ name: 'Search', query })
    }

    function buildSearchQuery() {
      const query = {}
      if (filters.value.make) query.make = filters.value.make
      if (filters.value.model) query.model = filters.value.model
      if (filters.value.priceMin) query.priceFrom = filters.value.priceMin
      if (filters.value.priceMax) query.priceTo = filters.value.priceMax
      if (filters.value.yearFrom) query.registrationFrom = filters.value.yearFrom
      if (filters.value.yearTo) query.registrationTo = filters.value.yearTo
      if (filters.value.kmMin) query.mileageFrom = filters.value.kmMin
      if (filters.value.kmMax) query.mileageTo = filters.value.kmMax
      return query
    }

    function resetSearchFilters() {
      filters.value.make = ''
      filters.value.model = ''
      filters.value.priceMin = ''
      filters.value.priceMax = ''
      filters.value.yearFrom = ''
      filters.value.yearTo = ''
      filters.value.kmMin = ''
      filters.value.kmMax = ''
    }

    function handleMoreFilters() {
      router.push({ name: 'AdvancedSearch', query: buildSearchQuery() })
    }

    const searchCardClass = computed(() => ['rounded-3xl', 'p-5', 'shadow-sm', 'sm:p-6', 'md:p-8', theme.value === 'dark' ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'].join(' '))
    const searchTitleClass = computed(() => ['text-xl', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
    const topDealsTitleClass = computed(() => ['text-3xl', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
    const arrowBtnClass = computed(() => ['rounded-full', 'p-2', 'transition', theme.value === 'dark' ? 'bg-gray-800 border border-gray-700 shadow-md text-gray-200 hover:bg-gray-700' : 'bg-white/90 border border-gray-200 shadow-md hover:bg-white'].join(' '))
    const labelClass = computed(() => ['mb-2', 'block', 'text-sm', 'font-medium', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700'].join(' '))
    const formSelectClass = computed(() => ['w-full', 'rounded-lg', 'border', 'px-3', 'py-2', 'text-sm', 'focus:border-blue-500', 'focus:outline-none', theme.value === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300 bg-white text-gray-700'].join(' '))

    return { swipeContainer, swipeCars, scrollNext, scrollPrev, searchCardClass, searchTitleClass, topDealsTitleClass, arrowBtnClass, labelClass, formSelectClass, handleSell, handleSearch, resetSearchFilters, handleMoreFilters, filters, availableMakes, availableModels }
  }
}
</script>
