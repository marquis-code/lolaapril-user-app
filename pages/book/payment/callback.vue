<template>
  <div class="min-h-screen  flex items-center justify-center p-4">
    <!-- Loading State -->
    <div v-if="verifying" class="text-center">
      <div class="mb-6">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
      <p class="text-gray-600 text-sm">Please wait while we verify your payment and secure your slot...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="verificationSuccess && paymentData" class="max-w-2xl w-full bg-white rounded-2xl border-[0.5px] border-gray-100 p-8">
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p class="text-gray-600 text-sm">Your booking has been confirmed</p>
      </div>

      <!-- Booking Summary -->
      <div class="space-y-6">
        <div class="border-t border-b border-gray-200 py-6">
          <h3 class="text-lg font-semibold text-gray-900 text-sm mb-4">Booking Details</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Booking Reference:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ bookingData?.bookingNumber }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Client Name:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ clientData?.firstName }} {{ clientData?.lastName }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Email:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ clientData?.email }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Service:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ bookingData?.services?.[0]?.serviceName }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Date:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ formatDate(bookingData?.preferredDate) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Time:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ bookingData?.preferredStartTime }} - {{ bookingData?.estimatedEndTime }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Duration:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ bookingData?.totalDuration }} mins</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Payment Method:</span>
              <span class="font-semibold text-gray-900 text-sm capitalize">{{ paymentData?.paymentMethod }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Payment Reference:</span>
              <span class="font-semibold text-gray-900 text-sm text-sm">{{ paymentData?.paymentReference }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600 text-sm">Transaction ID:</span>
              <span class="font-semibold text-gray-900 text-sm">{{ paymentData?.transactionId }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Breakdown -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Payment Summary</h4>
          
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Subtotal:</span>
              <span class="text-gray-900">₦{{ formatPrice(paymentData?.subtotal) }}</span>
            </div>
            
            <div v-if="paymentData?.totalDiscount > 0" class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Discount:</span>
              <span class="text-green-600">-₦{{ formatPrice(paymentData?.totalDiscount) }}</span>
            </div>
            
            <div v-if="paymentData?.totalTax > 0" class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Tax:</span>
              <span class="text-gray-900">₦{{ formatPrice(paymentData?.totalTax) }}</span>
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t border-gray-200">
              <span class="text-lg font-semibold text-gray-900 text-sm">Total Paid:</span>
              <span class="text-lg font-bold text-primary">₦{{ formatPrice(paymentData?.totalAmount) }}</span>
            </div>

            <div v-if="platformFeeData" class="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              <div class="flex justify-between">
                <span>Platform Fee ({{ platformFeeData.platformFeePercentage }}%):</span>
                <span>₦{{ formatPrice(platformFeeData.totalPlatformFee) }}</span>
              </div>
              <div class="flex justify-between mt-1">
                <span>Business Receives:</span>
                <span class="font-semibold">₦{{ formatPrice(platformFeeData.businessReceives) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Commission Info (if available) -->
        <div v-if="bookingData?.commissionInfo" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-purple-900 mb-2">Commission Details</h4>
          <div class="text-sm text-purple-800 space-y-1">
            <div class="flex justify-between">
              <span>Commission Rate:</span>
              <span class="font-semibold">{{ (bookingData.commissionInfo.commissionRate * 100) }}%</span>
            </div>
            <div class="flex justify-between">
              <span>Commission Amount:</span>
              <span class="font-semibold">₦{{ formatPrice(bookingData.commissionInfo.commissionAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Reason:</span>
              <span class="font-semibold capitalize">{{ bookingData.commissionInfo.commissionReason?.replace('_', ' ') }}</span>
            </div>
          </div>
        </div>

        <!-- Important Notice -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-blue-800">
              <p class="font-semibold mb-1">Important Information:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>A confirmation email has been sent to <strong>{{ clientData?.email }}</strong></li>
                <li>Please arrive <strong>10 minutes</strong> before your appointment time</li>
                <li>Bring a valid ID for verification</li>
                <li>For cancellations or rescheduling, contact us at least 24 hours in advance</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            @click="goToBookings"
            class="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            View My Bookings
          </button>
          
          <button
            @click="downloadReceipt"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-lg transition-all border border-gray-300"
          >
            Download Receipt
          </button>
        </div>

        <button
          @click="navigateTo('/')"
          class="w-full text-gray-600 text-sm hover:text-gray-900 font-medium py-2 transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="verificationError" class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
      <p class="text-gray-600 text-sm mb-6">{{ verificationError }}</p>
      
      <div class="space-y-3">
        <button
          @click="retryVerification"
          class="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Retry Verification
        </button>
        
        <button
          @click="navigateTo('/')"
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVerifyPayment } from '@/composables/modules/payment/useVerifyPayment'

const route = useRoute()
const router = useRouter()

const { verifyPayment } = useVerifyPayment()

const verifying = ref(true)
const verificationSuccess = ref(false)
const verificationError = ref<string | null>(null)
const paymentData = ref<any>(null)

// Computed properties for easier access to nested data
const bookingData = computed(() => paymentData.value?.bookingId)
const clientData = computed(() => paymentData.value?.clientId)
const platformFeeData = computed(() => paymentData.value?.metadata?.feeCalculation)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price: number) => {
  if (!price && price !== 0) return '0'
  return price.toLocaleString('en-NG')
}

const goToBookings = () => {
  navigateTo('/bookings')
}

const downloadReceipt = () => {
  // Create receipt content
  const receipt = `
PAYMENT RECEIPT
=====================================

Booking Reference: ${bookingData.value?.bookingNumber}
Transaction ID: ${paymentData.value?.transactionId}
Payment Reference: ${paymentData.value?.paymentReference}

Client Information:
-----------------------------------
Name: ${clientData.value?.firstName} ${clientData.value?.lastName}
Email: ${clientData.value?.email}
Phone: ${bookingData.value?.clientPhone}

Booking Details:
-----------------------------------
Service: ${bookingData.value?.services?.[0]?.serviceName}
Date: ${formatDate(bookingData.value?.preferredDate)}
Time: ${bookingData.value?.preferredStartTime} - ${bookingData.value?.estimatedEndTime}
Duration: ${bookingData.value?.totalDuration} minutes

Payment Summary:
-----------------------------------
Subtotal: ₦${formatPrice(paymentData.value?.subtotal)}
Tax: ₦${formatPrice(paymentData.value?.totalTax)}
Discount: ₦${formatPrice(paymentData.value?.totalDiscount)}
Total Paid: ₦${formatPrice(paymentData.value?.totalAmount)}

Payment Method: ${paymentData.value?.paymentMethod}
Payment Status: ${paymentData.value?.status}
Payment Date: ${new Date(paymentData.value?.paidAt).toLocaleString()}

=====================================
Thank you for your booking!
  `

  // Create and download file
  const blob = new Blob([receipt], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `receipt-${bookingData.value?.bookingNumber}.txt`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

const verifyPaymentFromUrl = async () => {
  try {
    verifying.value = true
    verificationError.value = null
    
    // Extract reference from URL query params
    const reference = route.query.reference as string || route.query.trxref as string
    
    if (!reference) {
      verificationError.value = 'Payment reference not found in URL'
      verifying.value = false
      return
    }

    // Verify payment
    const result = await verifyPayment(reference)
    console.log("Payment Verification Result:", result)
    
    if (result && result._id) {
      // Store the complete payment data
      paymentData.value = result
      verificationSuccess.value = true
    } else {
      verificationError.value = 'Payment verification failed. Please contact support with your payment reference.'
    }
  } catch (error: any) {
    console.error('Payment verification error:', error)
    verificationError.value = error.message || 'An error occurred during verification. Please try again or contact support.'
  } finally {
    verifying.value = false
  }
}

const retryVerification = () => {
  verifyPaymentFromUrl()
}

onMounted(() => {
  verifyPaymentFromUrl()
})
</script>

<style scoped>
.border-primary {
  border-color: var(--primary-color, #6366f1);
}

.bg-primary {
  background-color: var(--primary-color, #6366f1);
}

.bg-primary-700 {
  background-color: var(--primary-color-dark, #4f46e5);
}

.text-primary {
  color: var(--primary-color, #6366f1);
}

.hover\:bg-primary-700:hover {
  background-color: var(--primary-color-dark, #4f46e5);
}
</style>