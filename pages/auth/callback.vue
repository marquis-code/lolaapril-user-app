<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="text-gray-600">Completing sign in...</p>
      </div>
      
      <div v-else-if="error" class="space-y-4">
        <div class="text-red-500 text-5xl">⚠️</div>
        <h2 class="text-xl font-semibold text-gray-900">Authentication Failed</h2>
        <p class="text-gray-600">{{ error }}</p>
        <button 
          @click="navigateTo('/')"
          class="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-700"
        >
          Return Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const { accessToken, refreshToken, user } = route.query
    
    if (!accessToken || !refreshToken || !user) {
      throw new Error('Missing authentication data')
    }
    
    // Parse user data
    const userData = JSON.parse(decodeURIComponent(user as string))
    
    // Store tokens (adjust based on your auth store/composable)
    localStorage.setItem('accessToken', accessToken as string)
    localStorage.setItem('refreshToken', refreshToken as string)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Redirect to booking or home page
    await navigateTo('/book?subdomain=lola-beauty')
  } catch (err: any) {
    error.value = err.message || 'Authentication failed'
    loading.value = false
  }
})
</script>