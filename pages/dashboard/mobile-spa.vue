<template>
  <div class="min-h-screen pt-10">
    <div class="container mx-auto py-6 px-6">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Mobile Spa Requests</h1>
        <p class="text-sm text-gray-500 mt-1">Manage and track your mobile spa service requests.</p>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="bg-white rounded-xl border-[0.5px] border-gray-100 p-6 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gray-100 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-100 rounded w-1/4"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div class="w-20 h-6 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 bg-white rounded-xl border-[0.5px] border-gray-100">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 font-medium">Failed to load requests</p>
        <p class="text-gray-500 text-sm mt-1">{{ error }}</p>
        <button @click="getMobileSpaRequests" class="mt-4 px-4 py-2 bg-parentPrimary text-white rounded-lg text-sm font-medium">Retry</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="requests.length === 0" class="text-center py-16 bg-white rounded-xl border-[0.5px] border-gray-100">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <lucide-car class="w-10 h-10 text-gray-300" />
        </div>
        <p class="text-gray-900 font-semibold mb-1">No mobile spa requests</p>
        <p class="text-gray-500 text-sm mb-6 max-w-xs mx-auto">You haven't made any mobile spa requests yet. Bring the spa to your doorstep!</p>
        <button
          @click="navigateTo('/#book')"
          class="inline-flex items-center gap-2 bg-parentPrimary text-white font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Book Mobile Spa
        </button>
      </div>

      <!-- Requests List -->
      <div v-else class="space-y-4">
        <div
          v-for="request in requests"
          :key="request._id"
          class="bg-white rounded-xl border-[0.5px] border-gray-100 p-6 hover:shadow-sm transition-all cursor-pointer group"
          @click="selectRequest(request)"
        >
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <!-- Icon/Image -->
            <div class="w-14 h-14 bg-parentPrimary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <lucide-car class="w-7 h-7 text-parentPrimary" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-gray-900 truncate">
                  {{ request.services?.[0]?.serviceName || 'Mobile Spa Service' }}
                  <span v-if="request.services?.[1]" class="text-xs font-normal text-gray-400 ml-1">+{{ request.services.length - 1 }} more</span>
                </h3>
                <span :class="getStatusClass(request.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ request.status }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div class="flex items-center gap-2 text-gray-600">
                  <lucide-calendar class="w-4 h-4 text-gray-400" />
                  <span>{{ formatDate(request.requestedDate) }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <lucide-map-pin class="w-4 h-4 text-gray-400" />
                  <span class="truncate">{{ request.location?.address }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-900 font-semibold">
                  <span class="text-gray-400 font-normal">Total:</span>
                  <span>₦{{ formatPrice(request.totalAmount) }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 md:border-l md:pl-6 border-gray-100">
              <div class="text-right hidden md:block">
                <p class="text-[10px] text-gray-400 font-bold uppercase">{{ request.requestNumber }}</p>
                <p class="text-xs font-medium" :class="request.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'">
                  {{ request.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending' }}
                </p>
              </div>
              <lucide-chevron-right class="w-5 h-5 text-gray-300 group-hover:text-parentPrimary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <Transition name="modal">
      <div v-if="selectedRequest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="selectedRequest = null">
        <div class="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{{ selectedRequest.requestNumber }}</p>
              <h2 class="text-lg font-bold text-parentPrimary">Request Details</h2>
            </div>
            <button @click="selectedRequest = null" class="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
              <lucide-x class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <!-- Status and Date -->
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs text-gray-500 mb-1">Status</p>
                <span :class="getStatusClass(selectedRequest.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ selectedRequest.status }}
                </span>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 mb-1">Requested Date</p>
                <p class="font-bold text-gray-900">{{ formatDate(selectedRequest.requestedDate) }}</p>
              </div>
            </div>

            <!-- Services -->
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Services</p>
              <div class="space-y-3">
                <div v-for="(service, index) in selectedRequest.services" :key="index" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-bold text-gray-900 text-sm">{{ service.serviceName }}</p>
                    <p class="text-xs text-gray-500">Quantity: {{ service.quantity }}</p>
                  </div>
                  <p class="font-bold text-parentPrimary">₦{{ formatPrice(service.price * service.quantity) }}</p>
                </div>
              </div>
            </div>

            <!-- Location -->
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
              <div class="flex gap-3">
                <lucide-map-pin class="w-5 h-5 text-parentPrimary flex-shrink-0" />
                <div>
                  <p class="text-sm text-gray-900">{{ selectedRequest.location?.address }}</p>
                  <p v-if="selectedRequest.location?.additionalDirections" class="text-xs text-gray-500 mt-1 italic">
                    "{{ selectedRequest.location.additionalDirections }}"
                  </p>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="pt-6 border-t border-gray-100 flex justify-between items-center">
              <p class="font-bold text-gray-900">Total Amount</p>
              <p class="text-2xl font-bold text-parentPrimary">₦{{ formatPrice(selectedRequest.totalAmount) }}</p>
            </div>
          </div>

          <div class="p-6 bg-gray-50 border-t border-gray-100">
             <button
              @click="selectedRequest = null"
              class="w-full bg-parentPrimary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { 
  Car as LucideCar, 
  ChevronRight as LucideChevronRight, 
  Calendar as LucideCalendar, 
  MapPin as LucideMapPin,
  X as LucideX,
  CreditCard as LucideCreditCard
} from 'lucide-vue-next'
import { useGetMyMobileSpaRequests } from '@/composables/modules/mobile-spa/useGetMyMobileSpaRequests'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { requests, loading, error, getMobileSpaRequests } = useGetMyMobileSpaRequests()
const selectedRequest = ref<any>(null)

const selectRequest = (request: any) => {
  selectedRequest.value = request
}

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase()
  if (s === 'accepted' || s === 'completed') return 'bg-green-100 text-green-700 border border-green-200'
  if (s === 'pending') return 'bg-amber-100 text-amber-700 border border-amber-200'
  if (s === 'rejected' || s === 'cancelled') return 'bg-red-100 text-red-700 border border-red-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

const formatPrice = (price: number) => {
  if (!price) return '0'
  return price.toLocaleString()
}

onMounted(() => {
  getMobileSpaRequests()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
