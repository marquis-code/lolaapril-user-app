<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center space-y-4 max-w-md">
      <div class="text-red-500 text-5xl">❌</div>
      <h2 class="text-xl font-semibold text-gray-900">Sign In Failed</h2>
      <p class="text-gray-600">{{ errorMessage }}</p>
      <button 
        @click="navigateTo('/')"
        class="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-700"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const errorMessage = computed(() => 
  route.query.message || 'An unexpected error occurred during authentication'
)
</script>