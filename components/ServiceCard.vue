<template>
  <div
    class="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer h-80"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="goToBooking"
  >
    <img
      :src="image"
      :alt="title"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    <div
      class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-all duration-300"
      :class="isHovered ? 'from-black/80' : ''"
    />

    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
      <h3 class="text-2xl font-light mb-2">
        {{ title }}
      </h3>

      <button
        class="flex items-center space-x-2 text-sm transition-all duration-300 pointer-events-none"
        :class="isHovered ? 'translate-x-2' : ''"
      >
        <span>Book Now</span>
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  image: string
}>()

const isHovered = ref(false)

const goToBooking = () => {
  // navigateTo({
  //   path: '/book',
  //   query: {
  //     subdomain: 'lola-beauty',
  //   },
  // })
}
</script>
