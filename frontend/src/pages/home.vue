<template>
  <section class="space-y-6 py-6">
    <article class="relative overflow-hidden rounded-3xl bg-blue-500 px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-3xl font-semibold text-white sm:text-4xl">Ready to sell?</h1>
        <p class="mt-3 text-lg leading-snug text-blue-100 sm:text-2xl">
          Post your vehicle in minutes and reach thousands of local buyers.
        </p>

        <button
          type="button"
          class="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 text-2xl font-semibold text-blue-500 shadow-sm transition hover:bg-blue-50"
        >
          <i class="pi pi-plus-circle text-3xl"></i>
          <span>Sell Your Car</span>
        </button>
      </div>

      <i class="pi pi-car absolute -bottom-4 right-3 text-[220px] text-blue-400/40"></i>
    </article>

    <article class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <h2 class="text-xl font-semibold text-gray-900">General Search</h2>

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
            class="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-blue-500 px-10 py-2 text-lg font-semibold text-white transition hover:bg-blue-600 sm:w-auto"
          >
            <i class="pi pi-search text-lg"></i>
            <span>Search</span>
          </button>
          </div>
        </div>

      </div>

        <div class="mt-3 flex items-center justify-center gap-10 md:justify-end md:gap-8">
          <a href="#" class="inline-flex items-center gap-2 text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            <i class="pi pi-refresh"></i>
            <span>Reset</span>
          </a>
          <a href="#" class="inline-flex items-center gap-2 text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            <i class="pi pi-sliders-h"></i>
            <span>More filters</span>
          </a>
        </div>
    </article>

    <CarAdCard />
  </section>
</template>

<script>
import CarAdCard from '../components/CarAdCard.vue'

export default {
  name: 'HomePage',
  components: { CarAdCard }
}
</script>
