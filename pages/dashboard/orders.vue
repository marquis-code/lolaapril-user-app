<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-xl font-bold text-gray-900 mb-8">Product orders</h1>

      <div class="bg-white rounded-2xl border-[0.5px] border-gray-100 p-8">
        <div class="text-center py-16">
          <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p class="text-gray-900 text-lg font-semibold mb-2">No orders yet</p>
          <p class="text-gray-500 mb-6">Your product orders will appear here</p>
          <button
            @click="navigateTo('/shop')"
            class="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Browse Products
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