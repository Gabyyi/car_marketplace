<template>
  <div :class="containerClass">
    <div :class="imgWrapperClass">
      <img :src="car.image" :alt="car.make + ' ' + car.model" class="h-full w-full object-cover object-center" />
    </div>

    <div class="mt-3">
      <div :class="titleClass">{{ car.make }} {{ car.model }}</div>
      <div :class="priceClass">€{{ car.price }}</div>

      <div class="mt-2 flex flex-wrap gap-2 text-xs">
        <span v-for="(t, i) in tagList" :key="i" :class="tagClass">{{ t }}</span>
      </div>

      <div :class="locationClass">
        <i class="pi pi-map-marker mr-1 text-blue-600"></i>{{ car.location }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  car: {
    type: Object,
    default: () => ({
      image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80',
      make: 'BMW',
      model: 'M3',
      price: '45,000',
      fuelType: 'Petrol',
      gearbox: 'Automatic',
      power: '375hp',
      kilometers: '50,000 km',
      year: '2019',
      location: 'Bucharest'
    })
  }
})

const { theme } = useTheme()

const containerClass = computed(() => ['w-64', 'snap-start', 'shrink-0', 'rounded-xl', 'p-3', theme.value === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'].join(' '))
const imgWrapperClass = computed(() => ['aspect-4/3', 'overflow-hidden', 'rounded-md', theme.value === 'dark' ? 'bg-gray-800' : 'bg-gray-100'].join(' '))
const titleClass = computed(() => ['text-sm', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const priceClass = computed(() => ['mt-1', 'text-lg', 'font-medium', theme.value === 'dark' ? 'text-gray-100' : 'text-gray-900'].join(' '))
const tagClass = computed(() => ['rounded-full', 'px-2', 'py-1', theme.value === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'].join(' '))
const locationClass = computed(() => ['mt-8', 'text-sm', theme.value === 'dark' ? 'text-gray-300' : 'text-gray-600'].join(' '))

const tagList = computed(() => [props.car.year, props.car.kilometers, props.car.power, props.car.gearbox, props.car.fuelType].filter(Boolean))
</script>
