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
          class="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 text-2xl font-medium text-blue-500 shadow-sm transition hover:bg-blue-50"
        >
          <i class="pi pi-plus-circle text-3xl"></i>
          <span>Sell Your Car</span>
        </button>
      </div>

      <i class="pi pi-car absolute -bottom-4 right-3 text-[220px] text-blue-400/40"></i>
    </article>

    <article class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <h2 class="text-xl font-medium text-gray-900">General Search</h2>

      <div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">Make</label>
          <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
            <option>Any make</option>
            <option>BMW</option>
            <option>Audi</option>
            <option>Mercedes-Benz</option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">Model</label>
          <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
            <option>Any model</option>
            <option>Series 3</option>
            <option>A4</option>
            <option>C-Class</option>
          </select>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label class="mb-2 block text-sm font-medium text-gray-700">Price Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
              <option>Min</option>
              <option>€1,000</option>
              <option>€5,000</option>
              <option>€10,000</option>
              <option>€20,000</option>
            </select>
            <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
              <option>Max</option>
              <option>€10,000</option>
              <option>€20,000</option>
              <option>€30,000</option>
              <option>€50,000+</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label class="mb-2 block text-sm font-medium text-gray-700">Year Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
              <option>From</option>
              <option>2005</option>
              <option>2010</option>
              <option>2015</option>
              <option>2020</option>
            </select>
            <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
              <option>To</option>
              <option>2015</option>
              <option>2018</option>
              <option>2022</option>
              <option>2026</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label class="mb-2 block text-sm font-medium text-gray-700">Kilometers Range</label>
          <div class="grid grid-cols-2 gap-2">
            <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
              <option>Min</option>
              <option>0 km</option>
              <option>25,000 km</option>
              <option>50,000 km</option>
              <option>100,000 km</option>
            </select>
            <select class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
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

    <CarAdCard />

    <article class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <h2 class="text-3xl font-medium text-gray-900">Top deals for you</h2>
      <div class="mt-4 relative">
        <div ref="swipeContainer" class="-mx-3 flex gap-4 overflow-x-auto px-3 py-2 snap-x snap-mandatory touch-pan-x">
          <SwipeCar v-for="(c, idx) in swipeCars" :key="idx" :car="c" />
        </div>

        <div class="absolute right-2 top-1/2 hidden -translate-y-1/2 md:block">
          <button @click="scrollNext" class="rounded-full bg-white/90 p-2 shadow-md hover:bg-white">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
        <div class="absolute left-2 top-1/2 hidden -translate-y-1/2 md:block">
          <button @click="scrollPrev" class="rounded-full bg-white/90 p-2 shadow-md hover:bg-white">
            <i class="pi pi-chevron-left"></i>
          </button>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import { ref } from 'vue'
import CarAdCard from '../components/CarAdCard.vue'
import SwipeCar from '../components/SwipeCar.vue'

export default {
  name: 'HomePage',
  components: { CarAdCard, SwipeCar },
  setup() {
    const swipeContainer = ref(null)

    const swipeCars = [
      { image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80', make: 'BMW', model: 'M3', price: '45,000', fuelType: 'Petrol', gearbox: 'Automatic', power: '375hp', kilometers: '50,000 km', year: '2019', location: 'Bucharest' },
      { image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80', make: 'Audi', model: 'A4', price: '29,500', fuelType: 'Diesel', gearbox: 'Manual', power: '190hp', kilometers: '85,000 km', year: '2018', location: 'Cluj' },
      { image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80', make: 'Mercedes-Benz', model: 'C-Class', price: '34,200', fuelType: 'Petrol', gearbox: 'Automatic', power: '220hp', kilometers: '60,000 km', year: '2020', location: 'Timisoara' },
      { image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=800&q=80', make: 'Volkswagen', model: 'Golf', price: '15,000', fuelType: 'Diesel', gearbox: 'Manual', power: '150hp', kilometers: '120,000 km', year: '2017', location: 'Iasi' },
      { image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80', make: 'Ford', model: 'Focus', price: '12,500', fuelType: 'Petrol', gearbox: 'Manual', power: '125hp', kilometers: '90,000 km', year: '2016', location: 'Constanta' }
    ]

    function scrollNext() {
      if (!swipeContainer.value) return
      swipeContainer.value.scrollBy({ left: swipeContainer.value.clientWidth * 0.7, behavior: 'smooth' })
    }

    function scrollPrev() {
      if (!swipeContainer.value) return
      swipeContainer.value.scrollBy({ left: -swipeContainer.value.clientWidth * 0.7, behavior: 'smooth' })
    }

    return { swipeContainer, swipeCars, scrollNext, scrollPrev }
  }
}
</script>
