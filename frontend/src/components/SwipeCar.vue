<template>
  <div class="w-64 snap-start shrink-0 rounded-xl bg-white p-3">
    <div class="aspect-4/3 overflow-hidden rounded-md bg-gray-100">
      <img :src="car.image" :alt="car.make + ' ' + car.model" class="h-full w-full object-cover object-center" />
    </div>

    <div class="mt-3">
      <div class="text-sm font-medium text-gray-900">{{ car.make }} {{ car.model }}</div>
      <div class="mt-1 text-lg font-medium text-gray-900">€{{ car.price }}</div>

      <div class="mt-2 flex flex-wrap gap-2 text-xs">
        <span v-for="(t, i) in tagList" :key="i" class="rounded-full bg-gray-100 px-2 py-1 text-gray-700">{{ t }}</span>
      </div>

      <div class="mt-8 text-sm text-gray-600">
        <i class="pi pi-map-marker mr-1 text-blue-600"></i>{{ car.location }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwipeCar',
  props: {
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
  },
  computed: {
    tagList() {
      return [this.car.year, this.car.kilometers, this.car.power, this.car.gearbox, this.car.fuelType].filter(Boolean)
    }
  }
}
</script>
