<template>
  <div class="max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Required</h1>
      <p class="text-gray-600">Please complete your payment to confirm the booking.</p>
    </div>

    <!-- Booking Info Card -->
    <div class="bg-white shadow-lg rounded-xl p-6 w-full mb-8 border border-gray-100">
      <div v-if="selectedService" class="space-y-3">
        <div class="flex justify-between">
           <span class="text-gray-500">Service</span>
           <span class="font-medium text-right">{{ selectedService.basicDetails.serviceName }}</span>
        </div>
        <div class="flex justify-between">
           <span class="text-gray-500">Total Amount</span>
           <span class="font-bold text-xl text-primary">{{ formattedPrice }}</span>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        Booking details loaded...
      </div>
    </div>

    <button 
      @click="payNow"
      :disabled="loading"
      class="w-full bg-primary hover:bg-pink-600 text-white font-bold py-4 rounded-lg shadow-xl transition transform hover:scale-105"
    >
      <span v-if="loading">Initializing Payment...</span>
      <span v-else>Pay with Paystack</span>
    </button>
    
    <p class="mt-4 text-xs text-center text-gray-400">
      Secured by Paystack
    </p>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInitializePayment } from '@/composables/modules/payment/useInitializePayment'
import { useBookingState } from '@/composables/modules/booking/useBookingState'
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'
import { useUser } from '@/composables/modules/auth/user'

const route = useRoute()
const { bookingDetails, selectedService } = useBookingState()
const { business } = useGetBusiness() // Though maybe not strictly needed if we just use ID?
const { initializePayment, loading, error } = useInitializePayment()
const { user } = useUser()

const bookingId = route.params.id as string

// Computed for price display
const formattedPrice = computed(() => {
  if (selectedService.value && selectedService.value.pricingAndDuration) {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: selectedService.value.pricingAndDuration.price.currency 
    }).format(selectedService.value.pricingAndDuration.price.amount)
  }
  return '...'
})

const payNow = async () => {
  try {
     const payload = {
         email: user.value.email, // Placeholder if state lost, should ideally come from guestInfo
         amount: selectedService.value?.pricingAndDuration?.price?.amount || 5000, 
         bookingId: bookingId,
         clientId: bookingDetails.value.clientId || 'guest',
         subdomain: route.query.subdomain // Hardcoded based on prev payload, or use business.value?.id
     }
     
     const res: any = await initializePayment(payload)
     if (res && res.authorization_url) {
         window.location.href = res.authorization_url
     }
  } catch (e) {
      console.error(e)
  }
}
</script>
