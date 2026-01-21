<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Select Service</h1>
      <p class="text-gray-600">Choose a service to book</p>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-500">
      Failed to load services. Please try again.
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="service in services" 
        :key="service._id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-primary"
        @click="selectService(service)"
      >
        <h3 class="font-bold text-lg mb-2">{{ service.basicDetails.serviceName }}</h3>
        <p class="text-gray-500 text-sm mb-4 line-clamp-2">
          {{ service.basicDetails.description || 'No description available' }}
        </p>
        
        <div class="flex justify-between items-center mt-auto">
          <span class="font-bold text-primary">
            {{ formatPrice(service.pricingAndDuration.price) }}
          </span>
          <span class="text-sm text-gray-400">
            {{ formatDuration(service.pricingAndDuration.duration.servicingTime) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '@/types/service'
import { useGetServices } from '@/composables/modules/services/useGetServices'
import { useBookingState } from '@/composables/modules/booking/useBookingState'

const { services, loading, error, getServices } = useGetServices()
const { selectedService } = useBookingState()
const router = useRouter()
const route = useRoute()

onMounted(() => {
    if (route.query.subdomain) {
        getServices(route.query.subdomain as string)
    }
})

const formatPrice = (price: any) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: price.currency }).format(price.amount)
}

const formatDuration = (duration: any) => {
  return `${duration.value} ${duration.unit}`
}

const selectService = (service: Service) => {
  selectedService.value = service
  router.push({
    path: '/book/date',
    query: { subdomain: route.query.subdomain }
  })
}
</script>
