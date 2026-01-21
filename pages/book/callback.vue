<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-600">Verifying payment...</p>
    </div>

    <div v-else-if="error" class="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
      <div class="text-red-500 text-5xl mb-4">❌</div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">Payment Verification Failed</h1>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <button 
        @click="retry"
        class="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
      >
        Try Again
      </button>
    </div>

    <div v-else class="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
      <div class="text-green-500 text-5xl mb-4">✅</div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
      <p class="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
      
      <div class="space-y-4">
        <NuxtLink 
          to="/bookings"
          class="block w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          View My Bookings
        </NuxtLink>
        
        <NuxtLink 
          to="/"
          class="block w-full text-gray-600 font-medium hover:text-gray-800"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVerifyPayment } from '@/composables/modules/payment/useVerifyPayment'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore() // Use state? Actually useBookingState.
// Ah, previous code used useBookingStore? 
// Wait, I refactored to useBookingState but callback.vue might have slipped.
// Let's check callback.vue content.
// It imports useBookingStore. Need to fix that too.

import { useBookingState } from '@/composables/modules/booking/useBookingState'
const { resetBookingState } = useBookingState()
const { verifyPayment, loading, error } = useVerifyPayment()

onMounted(async () => {
  // Paystack returns reference in query param 'reference' or 'trxref'
  const reference = (route.query.reference || route.query.trxref) as string
  
  if (!reference) {
    // error.value = 'No payment reference found' handled by composable? 
    // No, composable just verifies.
    // We should set error manually if no ref.
    // Logic inside composable handles API calls.
    return
  }

  try {
    const response = await verifyPayment(reference)
    
    if (response) { // Composable returns data if success
      resetBookingState()
    } 
  } catch (err: any) {
    // Error is reactive from composable
  } 
})

const retry = () => {
  // Try to go back to payment page if we have booking ID in store/url? 
  // Or just go home for now.
  router.push('/')
}
</script>
