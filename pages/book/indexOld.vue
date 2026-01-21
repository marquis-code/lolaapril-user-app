<template>
  <div class="min-h-screen flex flex-col justify-center items-center p-4">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-600">Loading business details...</p>
    </div>

    <div v-else-if="error" class="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
      <div class="text-red-500 text-5xl mb-4">⚠️</div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">Business Not Found</h1>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <p class="text-sm text-gray-500">Please check the link and try again.</p>
    </div>

    <div v-else-if="business" class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="bg-primary h-32 flex items-center justify-center relative">
        <div v-if="business.logo" class="absolute -bottom-10 bg-white p-2 rounded-full shadow-md">
          <img :src="business.logo" alt="Logo" class="w-20 h-20 rounded-full object-cover">
        </div>
        <div v-else class="absolute -bottom-10 bg-white p-2 rounded-full shadow-md">
           <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
             {{ business.businessName.charAt(0) }}
           </div>
        </div>
      </div>

      <div class="pt-14 pb-8 px-6 text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ business.businessName }}</h1>
        <p class="text-gray-600 text-sm mb-6">{{ business.businessDescription || 'Welcome to our booking page.' }}</p>

        <div class="space-y-4">
          <button 
            @click="startBooking"
            class="w-full bg-primary  text-white font-bold py-3 px-6 rounded-full text-sm transition duration-200 shadow-md transform hover:scale-105"
          >
            Book Appointment
          </button>
          
          <div class="text-sm text-gray-400 mt-4">
            <p>{{ business.address.street }}, {{ business.address.city }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'

const { business, loading, error } = useGetBusiness()
const router = useRouter()
const route = useRoute()

const startBooking = () => {
  router.push({
    path: '/book/services',
    query: { subdomain: route.query.subdomain } // Preserve subdomain
  })
}

// Set page title
useHead({
  title: computed(() => business.value?.businessName || 'Welcome')
})
</script>
