<template>
  <section :class="pageClass">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:py-12">
      <div class="overflow-hidden rounded-4xl border shadow-2xl" :class="shellClass">
        <div class="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="relative overflow-hidden border-b border-white/5 p-6 sm:p-8 lg:border-b-0 lg:border-r" :class="panelClass">
            <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-orange-500"></div>
            <div class="max-w-xl">
              <p class="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">Refine results</p>
              <h1 class="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl" :class="titleClass">Advanced Search</h1>
              <p class="mt-4 text-sm leading-6 sm:text-base" :class="helperClass">
                Use the filters below to narrow your search by make, model, price, mileage, and year.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-2">
                <div :class="fieldCardClass">
                  <label :class="labelClass">Make</label>
                  <select v-model="filters.make" :class="selectClass">
                    <option value="">Any</option>
                    <option v-for="make in availableMakes" :key="make" :value="make">{{ make }}</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Model</label>
                  <select v-model="filters.model" :class="selectClass" :disabled="!filters.make">
                    <option value="">Any</option>
                    <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Price from</label>
                  <select v-model="filters.priceFrom" :class="selectClass">
                    <option value="">Any</option>
                    <option value="500">€500</option>
                    <option value="1000">€1,000</option>
                    <option value="2500">€2,500</option>
                    <option value="5000">€5,000</option>
                    <option value="10000">€10,000</option>
                    <option value="15000">€15,000</option>
                    <option value="20000">€20,000</option>
                    <option value="30000">€30,000</option>
                    <option value="50000">€50,000</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Price to</label>
                  <select v-model="filters.priceTo" :class="selectClass">
                    <option value="">Any</option>
                    <option value="5000">€5,000</option>
                    <option value="10000">€10,000</option>
                    <option value="15000">€15,000</option>
                    <option value="20000">€20,000</option>
                    <option value="30000">€30,000</option>
                    <option value="50000">€50,000</option>
                    <option value="100000">€100,000+</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Kilometers from</label>
                  <select v-model="filters.mileageFrom" :class="selectClass">
                    <option value="">Any</option>
                    <option value="0">0 km</option>
                    <option value="10000">10,000 km</option>
                    <option value="25000">25,000 km</option>
                    <option value="50000">50,000 km</option>
                    <option value="75000">75,000 km</option>
                    <option value="100000">100,000 km</option>
                    <option value="150000">150,000 km</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Kilometers to</label>
                  <select v-model="filters.mileageTo" :class="selectClass">
                    <option value="">Any</option>
                    <option value="25000">25,000 km</option>
                    <option value="50000">50,000 km</option>
                    <option value="75000">75,000 km</option>
                    <option value="100000">100,000 km</option>
                    <option value="150000">150,000 km</option>
                    <option value="200000">200,000 km</option>
                    <option value="300000">300,000+ km</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Year from</label>
                  <select v-model="filters.registrationFrom" :class="selectClass">
                    <option value="">Any</option>
                    <option v-for="year in yearOptions" :key="`from-${year}`" :value="year">{{ year }}</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Year to</label>
                  <select v-model="filters.registrationTo" :class="selectClass">
                    <option value="">Any</option>
                    <option v-for="year in yearOptions" :key="`to-${year}`" :value="year">{{ year }}</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Transmission</label>
                  <select v-model="filters.transmission" :class="selectClass">
                    <option value="">Any</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="cvt">CVT</option>
                    <option value="dct">DCT</option>
                  </select>
                </div>

                <div :class="fieldCardClass">
                  <label :class="labelClass">Fuel type</label>
                  <select v-model="filters.fuelType" :class="selectClass">
                    <option value="">Any</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                    <option value="lpg">LPG</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <aside class="p-6 sm:p-8" :class="asideClass">
            <div class="sticky top-8 space-y-6">
              <div :class="summaryCardClass">
                <p class="text-sm uppercase tracking-[0.25em] text-blue-400">Selected filters</p>
                <div class="mt-4 space-y-2 text-sm" :class="summaryTextClass">
                  <div class="flex justify-between gap-4"><span>Make</span><span class="font-medium">{{ filters.make || 'Any' }}</span></div>
                  <div class="flex justify-between gap-4"><span>Model</span><span class="font-medium">{{ filters.model || 'Any' }}</span></div>
                  <div class="flex justify-between gap-4"><span>Price</span><span class="font-medium">{{ filters.priceFrom || 'Any' }} - {{ filters.priceTo || 'Any' }}</span></div>
                  <div class="flex justify-between gap-4"><span>Kilometers</span><span class="font-medium">{{ filters.mileageFrom || 'Any' }} - {{ filters.mileageTo || 'Any' }}</span></div>
                  <div class="flex justify-between gap-4"><span>Years</span><span class="font-medium">{{ filters.registrationFrom || 'Any' }} - {{ filters.registrationTo || 'Any' }}</span></div>
                </div>
              </div>

              <div :class="featureCardClass">
                <h2 :class="featureTitleClass">Features</h2>
                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <label :class="checkboxLabelClass"><input v-model="filters.airConditioning" type="checkbox" :class="checkboxClass"><span>Air Conditioning</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.heatedSeats" type="checkbox" :class="checkboxClass"><span>Heated Seats</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.sunroof" type="checkbox" :class="checkboxClass"><span>Sunroof</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.leatherSeats" type="checkbox" :class="checkboxClass"><span>Leather Seats</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.navigationSystem" type="checkbox" :class="checkboxClass"><span>Navigation System</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.parkingSensors" type="checkbox" :class="checkboxClass"><span>Parking Sensors</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.backupCamera" type="checkbox" :class="checkboxClass"><span>Backup Camera</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.bluetooth" type="checkbox" :class="checkboxClass"><span>Bluetooth</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.allWheelDrive" type="checkbox" :class="checkboxClass"><span>All-Wheel Drive</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.keylessEntry" type="checkbox" :class="checkboxClass"><span>Keyless Entry</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.panoramicRoof" type="checkbox" :class="checkboxClass"><span>Panoramic Roof</span></label>
                  <label :class="checkboxLabelClass"><input v-model="filters.adaptiveCruiseControl" type="checkbox" :class="checkboxClass"><span>Adaptive Cruise Control</span></label>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <button @click="handleBack" type="button" :class="cancelBtnClass">Back</button>
                <button @click="handleReset" type="button" :class="resetBtnClass">Reset All</button>
              </div>
              <button @click="handleApply" type="button" :class="applyBtnClass" class="w-full">Apply Filters</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

export default {
  name: 'AdvancedSearch',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { theme } = useTheme()

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

    const filters = ref({
      make: '',
      model: '',
      priceFrom: '',
      priceTo: '',
      mileageFrom: '',
      mileageTo: '',
      registrationFrom: '',
      registrationTo: '',
      bodyType: '',
      transmission: '',
      fuelType: '',
      doors: '',
      color: '',
      condition: '',
      airConditioning: false,
      heatedSeats: false,
      sunroof: false,
      leatherSeats: false,
      navigationSystem: false,
      parkingSensors: false,
      backupCamera: false,
      bluetooth: false,
      allWheelDrive: false,
      keylessEntry: false,
      panoramicRoof: false,
      adaptiveCruiseControl: false
    })

    const availableMakes = computed(() => Object.keys(carMakes).sort())
    const availableModels = computed(() => {
      if (!filters.value.make) return []
      return carMakes[filters.value.make] || []
    })

    const yearOptions = computed(() => {
      const years = []
      for (let year = 2026; year >= 2000; year -= 1) years.push(String(year))
      return years
    })

    const pageClass = computed(() => 
      theme.value === 'dark' ? 'bg-gray-900 min-h-screen' : 'bg-white min-h-screen'
    )

    const cardClass = computed(() => 
      ['rounded-3xl', 'p-6', 'md:p-8', 'shadow-sm', theme.value === 'dark' ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'].join(' ')
    )

    const titleClass = computed(() =>
      ['text-3xl', 'font-bold', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' ')
    )

    const helperClass = computed(() => theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600')

    const shellClass = computed(() => theme.value === 'dark'
      ? 'border-white/10 bg-[#11192a]'
      : 'border-gray-200 bg-white'
    )

    const panelClass = computed(() => theme.value === 'dark'
      ? 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(180deg,_rgba(9,13,24,0.95),_rgba(17,25,42,0.95))] text-gray-100'
      : 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] text-gray-900'
    )

    const asideClass = computed(() => theme.value === 'dark'
      ? 'bg-[#0c1321]'
      : 'bg-slate-50'
    )

    const fieldCardClass = computed(() => theme.value === 'dark'
      ? 'rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur'
      : 'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'
    )

    const summaryCardClass = computed(() => theme.value === 'dark'
      ? 'rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg'
      : 'rounded-3xl border border-gray-200 bg-white p-5 shadow-lg'
    )

    const summaryTextClass = computed(() => theme.value === 'dark' ? 'text-gray-300' : 'text-gray-600')

    const noticeClass = computed(() => theme.value === 'dark'
      ? 'border-blue-500/20 bg-blue-500/10'
      : 'border-blue-200 bg-blue-50'
    )

    const noticeTitleClass = computed(() => theme.value === 'dark' ? 'text-blue-200' : 'text-blue-700')

    const featureCardClass = computed(() => theme.value === 'dark'
      ? 'rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg'
      : 'rounded-3xl border border-gray-200 bg-white p-5 shadow-lg'
    )

    const labelClass = computed(() =>
      ['block', 'text-sm', 'font-medium', 'mb-2', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700'].join(' ')
    )

    const selectClass = computed(() =>
      ['w-full', 'px-4', 'py-3', 'rounded-2xl', 'border', 'text-sm', 'transition', 'focus:border-blue-500', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500/20', theme.value === 'dark' ? 'border-white/10 bg-white/5 text-gray-100 placeholder:text-gray-500' : 'border-gray-200 bg-white text-gray-800'].join(' ')
    )

    const featureTitleClass = computed(() =>
      ['text-xl', 'font-semibold', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' ')
    )

    const checkboxLabelClass = computed(() =>
      ['flex', 'items-center', 'gap-2', 'cursor-pointer', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700'].join(' ')
    )

    const checkboxClass = computed(() =>
      ['w-4', 'h-4', 'rounded', theme.value === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'].join(' ')
    )

    const applyBtnClass = computed(() =>
      ['px-6', 'py-3', 'rounded-2xl', 'font-semibold', 'text-white', 'bg-gradient-to-r', 'from-blue-500', 'to-cyan-500', 'shadow-lg', 'shadow-blue-500/20', 'transition', 'hover:from-blue-400', 'hover:to-cyan-400'].join(' ')
    )

    const resetBtnClass = computed(() =>
      ['px-6', 'py-3', 'rounded-2xl', 'font-medium', 'transition', theme.value === 'dark' ? 'border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'].join(' ')
    )

    const cancelBtnClass = computed(() =>
      ['px-6', 'py-3', 'rounded-2xl', 'font-medium', 'transition', theme.value === 'dark' ? 'border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'].join(' ')
    )

    function handleBack() {
      router.back()
    }

    function handleReset() {
      filters.value = {
        make: '',
        model: '',
        priceFrom: '',
        priceTo: '',
        mileageFrom: '',
        mileageTo: '',
        registrationFrom: '',
        registrationTo: '',
        bodyType: '',
        transmission: '',
        fuelType: '',
        doors: '',
        color: '',
        condition: '',
        airConditioning: false,
        heatedSeats: false,
        sunroof: false,
        leatherSeats: false,
        navigationSystem: false,
        parkingSensors: false,
        backupCamera: false,
        bluetooth: false,
        allWheelDrive: false,
        keylessEntry: false,
        panoramicRoof: false,
        adaptiveCruiseControl: false
      }
    }

    function syncFromQuery() {
      const query = route.query
      const keys = Object.keys(filters.value)
      keys.forEach((key) => {
        const value = query[key]
        if (value === undefined || value === null) return
        if (typeof filters.value[key] === 'boolean') {
          filters.value[key] = value === 'true'
        } else {
          filters.value[key] = String(value)
        }
      })
    }

    function handleApply() {
      const query = {}
      if (filters.value.make) query.make = filters.value.make
      if (filters.value.model) query.model = filters.value.model
      if (filters.value.priceFrom) query.priceFrom = filters.value.priceFrom
      if (filters.value.priceTo) query.priceTo = filters.value.priceTo
      if (filters.value.mileageFrom) query.mileageFrom = filters.value.mileageFrom
      if (filters.value.mileageTo) query.mileageTo = filters.value.mileageTo
      if (filters.value.registrationFrom) query.registrationFrom = filters.value.registrationFrom
      if (filters.value.registrationTo) query.registrationTo = filters.value.registrationTo
      if (filters.value.bodyType) query.bodyType = filters.value.bodyType
      if (filters.value.transmission) query.transmission = filters.value.transmission
      if (filters.value.fuelType) query.fuelType = filters.value.fuelType
      if (filters.value.doors) query.doors = filters.value.doors
      if (filters.value.color) query.color = filters.value.color
      if (filters.value.condition) query.condition = filters.value.condition
      
      // Add features as comma-separated string
      const features = []
      if (filters.value.airConditioning) features.push('airConditioning')
      if (filters.value.heatedSeats) features.push('heatedSeats')
      if (filters.value.sunroof) features.push('sunroof')
      if (filters.value.leatherSeats) features.push('leatherSeats')
      if (filters.value.navigationSystem) features.push('navigationSystem')
      if (filters.value.parkingSensors) features.push('parkingSensors')
      if (filters.value.backupCamera) features.push('backupCamera')
      if (filters.value.bluetooth) features.push('bluetooth')
      if (filters.value.allWheelDrive) features.push('allWheelDrive')
      if (filters.value.keylessEntry) features.push('keylessEntry')
      if (filters.value.panoramicRoof) features.push('panoramicRoof')
      if (filters.value.adaptiveCruiseControl) features.push('adaptiveCruiseControl')
      
      if (features.length > 0) query.features = features.join(',')
      
      router.push({ name: 'Search', query })
    }

    watch(() => filters.value.make, () => {
      if (filters.value.model && !availableModels.value.includes(filters.value.model)) {
        filters.value.model = ''
      }
    })

    onMounted(() => {
      syncFromQuery()
    })

    return { filters, pageClass, cardClass, titleClass, helperClass, labelClass, selectClass, featureTitleClass, checkboxLabelClass, checkboxClass, applyBtnClass, resetBtnClass, cancelBtnClass, handleBack, handleReset, handleApply, availableMakes, availableModels, yearOptions }
  }
}
</script>
