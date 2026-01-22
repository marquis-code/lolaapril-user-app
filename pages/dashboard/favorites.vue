<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Favorites</h1>

      <div class="bg-white rounded-2xl border border-gray-200 p-8">
        <div class="text-center py-16">
          <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p class="text-gray-900 text-lg font-semibold mb-2">No favorites yet</p>
          <p class="text-gray-500 mb-6">Save your favorite salons and services here</p>
          <button
            @click="navigateTo('/#book')"
            class="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Browse Salons
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>