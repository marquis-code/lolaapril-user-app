<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="verifying" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-3 border-primary mx-auto"></div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
        <p class="text-gray-600 text-sm">Please wait while we confirm your transaction...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="verificationSuccess && paymentData" class="space-y-4">
        <!-- Header Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 text-center">
          <div class="mx-auto w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Payment Successful</h1>
          <p class="text-sm text-gray-600">Your booking has been confirmed</p>
          
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-center gap-2 text-sm">
              <span class="text-gray-600">Reference:</span>
              <span class="font-mono font-semibold text-gray-900">{{ bookingData?.bookingNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Appointment Details Card -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
          
          <div class="space-y-3">
            <div class="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ bookingData?.services?.[0]?.serviceName }}</p>
                <p class="text-sm text-gray-600 mt-0.5">{{ bookingData?.totalDuration }} minutes</p>
              </div>
            </div>

            <div class="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ formatDate(bookingData?.preferredDate) }}</p>
                <p class="text-sm text-gray-600 mt-0.5">{{ bookingData?.preferredStartTime }} - {{ bookingData?.estimatedEndTime }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ clientData?.firstName }} {{ clientData?.lastName }}</p>
                <p class="text-sm text-gray-600 mt-0.5 truncate">{{ clientData?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Summary Card -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium text-gray-900">₦{{ formatPrice(paymentData?.subtotal) }}</span>
            </div>
            
            <div v-if="paymentData?.totalDiscount > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Discount</span>
              <span class="font-medium text-green-600">-₦{{ formatPrice(paymentData?.totalDiscount) }}</span>
            </div>
            
            <div v-if="paymentData?.totalTax > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="font-medium text-gray-900">₦{{ formatPrice(paymentData?.totalTax) }}</span>
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t border-gray-200">
              <span class="text-base font-semibold text-gray-900">Total Paid</span>
              <span class="text-xl font-bold text-primary">₦{{ formatPrice(paymentData?.totalAmount) }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600 mb-1">Payment Method</p>
                <p class="font-medium text-gray-900 capitalize">{{ paymentData?.paymentMethod }}</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1">Transaction ID</p>
                <p class="font-mono text-xs font-medium text-gray-900 truncate" :title="paymentData?.transactionId">
                  {{ paymentData?.transactionId }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Commission Info (if available) -->
        <div v-if="bookingData?.commissionInfo" class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Commission Details</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Commission Rate</span>
              <span class="font-medium text-gray-900">{{ (bookingData.commissionInfo.commissionRate * 100) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Commission Amount</span>
              <span class="font-medium text-gray-900">₦{{ formatPrice(bookingData.commissionInfo.commissionAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Reason</span>
              <span class="font-medium text-gray-900 capitalize">{{ bookingData.commissionInfo.commissionReason?.replace('_', ' ') }}</span>
            </div>
          </div>
        </div>

        <!-- Platform Fee (if available) -->
        <div v-if="platformFeeData" class="bg-gray-50 rounded-xl p-4">
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Platform Fee ({{ platformFeeData.platformFeePercentage }}%)</span>
              <span>₦{{ formatPrice(platformFeeData.totalPlatformFee) }}</span>
            </div>
            <div class="flex justify-between font-medium text-gray-900">
              <span>Business Receives</span>
              <span>₦{{ formatPrice(platformFeeData.businessReceives) }}</span>
            </div>
          </div>
        </div>

        <!-- Important Notice -->
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-blue-900">
              <p class="font-medium mb-2">Important Reminders</p>
              <ul class="space-y-1 text-blue-800">
                <li>• Confirmation email sent to <strong>{{ clientData?.email }}</strong></li>
                <li>• Arrive 10 minutes early</li>
                <li>• Bring a valid ID</li>
                <li>• Cancel/reschedule 24 hours in advance</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 pt-6">
          <button
            @click="goToBookings"
            class="w-full bg-[#005967] text-white font-semibold py-3.5 text-sm rounded-full transition-all shadow-sm"
          >
            View My Bookings
          </button>
          
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="downloadReceipt"
              class="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full text-sm transition-all border border-gray-200"
            >
              Download Receipt
            </button>
            
            <button
              @click="navigateTo('/')"
              class="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full text-sm transition-all border border-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationError" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Verification Failed</h2>
        <p class="text-sm text-gray-600 mb-6 max-w-md mx-auto">{{ verificationError }}</p>
        
        <div class="space-y-3 max-w-sm mx-auto">
          <button
            @click="retryVerification"
            class="w-full bg-[#005967] text-white rounded-full text-sm font-semibold py-3 transition-all"
          >
            Retry Verification
          </button>
          
          <button
            @click="navigateTo('/')"
            class="w-full bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 font-medium py-3 transition-all"
          >
            Return to Home
          </button>
        </div>
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
  navigateTo('/dashboard/bookings')
}

const downloadReceipt = () => {
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
    
    const reference = route.query.reference as string || route.query.trxref as string
    
    if (!reference) {
      verificationError.value = 'Payment reference not found in URL'
      verifying.value = false
      return
    }

    const result = await verifyPayment(reference)
    console.log("Payment Verification Result:", result)
    
    if (result && result._id) {
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

.bg-primary\/90 {
  background-color: var(--primary-color, #6366f1);
  opacity: 0.9;
}

.bg-primary\/10 {
  background-color: var(--primary-color, #6366f1);
  opacity: 0.1;
}

.text-primary {
  color: var(--primary-color, #6366f1);
}

.hover\:bg-primary\/90:hover {
  background-color: var(--primary-color, #6366f1);
  opacity: 0.9;
}
</style>