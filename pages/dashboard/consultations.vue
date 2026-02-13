<template>
  <div class="min-h-screen pt-10">
    <div class="container mx-auto py-6 px-6">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Virtual Consultations</h1>
        <p class="text-sm text-gray-500 mt-1">Manage and attend your skincare consultation sessions.</p>
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
        <p class="text-red-600 font-medium">Failed to load consultations</p>
        <p class="text-gray-500 text-sm mt-1">{{ error }}</p>
        <button @click="getConsultationBookings" class="mt-4 px-4 py-2 bg-parentPrimary text-white rounded-lg text-sm font-medium">Retry</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="text-center py-16 bg-white rounded-xl border-[0.5px] border-gray-100">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <lucide-video class="w-10 h-10 text-gray-300" />
        </div>
        <p class="text-gray-900 font-semibold mb-1">No consultations found</p>
        <p class="text-gray-500 text-sm mb-6 max-w-xs mx-auto">You haven't booked any skincare consultations yet. Expert advice is just a click away.</p>
        <button
          @click="navigateTo('/#services')"
          class="inline-flex items-center gap-2 bg-parentPrimary text-white font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Book Consultation
        </button>
      </div>

      <!-- Bookings List -->
      <div v-else class="space-y-4">
        <div
          v-for="booking in bookings"
          :key="booking._id"
          class="bg-white rounded-xl border-[0.5px] border-gray-100 p-6 hover:shadow-sm transition-all cursor-pointer group"
          @click="selectBooking(booking)"
        >
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <!-- Icon/Image -->
            <div class="w-14 h-14 bg-parentPrimary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <lucide-video class="w-7 h-7 text-parentPrimary" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-gray-900 truncate">
                  {{ booking.packageId?.name || 'Skincare Consultation' }}
                </h3>
                <span :class="getStatusClass(booking.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ booking.status }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div class="flex items-center gap-2 text-gray-600">
                  <lucide-calendar class="w-4 h-4 text-gray-400" />
                  <span>{{ formatDateTime(booking.startTime) }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <lucide-clock class="w-4 h-4 text-gray-400" />
                  <span>{{ booking.packageId?.duration || 30 }} minutes</span>
                </div>
                <div class="flex items-center gap-2 text-gray-900 font-semibold">
                  <span class="text-gray-400 font-normal">Business:</span>
                  <span class="truncate">{{ booking.businessId?.basicDetails?.name || 'Lola April Beauty' }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 md:border-l md:pl-6 border-gray-100">
              <div class="text-right hidden md:block">
                <p class="text-[10px] text-gray-400 font-bold uppercase">₦{{ formatPrice(booking.packageId?.price) }}</p>
                <p class="text-xs font-medium" :class="booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'">
                  {{ booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending' }}
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
      <div v-if="selectedBooking" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="selectedBooking = null">
        <div class="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Consultation ID: {{ selectedBooking._id.slice(-8).toUpperCase() }}</p>
              <h2 class="text-lg font-bold text-parentPrimary">Booking Details</h2>
            </div>
            <button @click="selectedBooking = null" class="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
              <lucide-x class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <!-- Package Info -->
            <div class="bg-parentPrimary/5 p-4 rounded-xl border border-parentPrimary/10">
              <h3 class="font-bold text-parentPrimary text-lg mb-1">{{ selectedBooking.packageId?.name }}</h3>
              <p class="text-sm text-gray-600">{{ selectedBooking.packageId?.duration }} Minute Session • ₦{{ formatPrice(selectedBooking.packageId?.price) }}</p>
            </div>

            <!-- Time and Status -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-xs text-gray-500 mb-1">Appointment Time</p>
                <p class="font-bold text-gray-900">{{ formatDateTime(selectedBooking.startTime) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Status</p>
                <span :class="getStatusClass(selectedBooking.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ selectedBooking.status }}
                </span>
              </div>
            </div>

            <!-- Meeting Link -->
            <div v-if="selectedBooking.meetingLink" class="p-4 bg-green-50 border border-green-100 rounded-xl">
              <p class="text-xs text-green-600 font-bold uppercase tracking-widest mb-2">Meeting Link</p>
              <a :href="selectedBooking.meetingLink" target="_blank" class="flex items-center gap-3 text-parentPrimary font-bold hover:underline">
                <lucide-video class="w-5 h-5" />
                Join Virtual Meeting
              </a>
            </div>
            <div v-else-if="selectedBooking.paymentStatus !== 'paid'" class="p-4 bg-amber-50 border border-amber-100 rounded-xl">
               <p class="text-sm text-amber-800">Your meeting link will be generated once payment is confirmed.</p>
            </div>

            <!-- Notes -->
            <div v-if="selectedBooking.notes">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">My Notes</p>
              <p class="text-sm text-gray-700 italic border-l-4 border-gray-100 pl-4 py-1">
                "{{ selectedBooking.notes }}"
              </p>
            </div>

            <!-- Business Info -->
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Business</p>
              <p class="text-sm font-bold text-gray-900">{{ selectedBooking.businessId?.basicDetails?.name }}</p>
            </div>
          </div>

          <div class="p-6 bg-gray-50 border-t border-gray-100">
             <button
              @click="selectedBooking = null"
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
  Video as LucideVideo, 
  ChevronRight as LucideChevronRight, 
  Calendar as LucideCalendar, 
  Clock as LucideClock,
  X as LucideX,
  ExternalLink as LucideExternalLink
} from 'lucide-vue-next'
import { useGetMyConsultationBookings } from '@/composables/modules/consultation/useGetMyConsultationBookings'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { bookings, loading, error, getConsultationBookings } = useGetMyConsultationBookings()
const selectedBooking = ref<any>(null)

const selectBooking = (booking: any) => {
  selectedBooking.value = booking
}

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase()
  if (s === 'confirmed') return 'bg-green-100 text-green-700 border border-green-200'
  if (s === 'pending') return 'bg-amber-100 text-amber-700 border border-amber-200'
  if (s === 'completed') return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (s === 'cancelled') return 'bg-red-100 text-red-700 border border-red-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  if (!price) return '0'
  return price.toLocaleString()
}

onMounted(() => {
  getConsultationBookings()
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
