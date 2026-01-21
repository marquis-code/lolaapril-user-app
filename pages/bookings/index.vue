<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Bookings</h1>
      <NuxtLink to="/profile" class="text-primary hover:text-pink-600">My Profile</NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-500">
      Failed to load bookings. {{ error.message }}
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500">You have no upcoming bookings.</p>
      <NuxtLink to="/book" class="mt-4 inline-block text-primary font-medium">Book an Appointment</NuxtLink>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="booking in bookings" :key="booking._id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-primary truncate">
                {{ booking.services[0]?.serviceName }}
              </p>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  Ticket #{{ booking.bookingNumber }}
                </p>
                <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  {{ formatDate(booking.preferredDate) }} at {{ booking.preferredStartTime }}
                </p>
              </div>
              <div class="mt-2 flex items-center gap-3 text-sm sm:mt-0">
                <button 
                  v-if="canReschedule(booking)"
                  @click="openRescheduleModal(booking)"
                  class="text-primary hover:text-pink-600 font-medium text-sm"
                >
                  Reschedule
                </button>
                <button 
                  v-if="canCancel(booking)"
                  @click="handleCancel(booking._id)"
                  :disabled="loadingCancel === booking._id"
                  class="text-red-600 hover:text-red-900 font-medium text-sm disabled:opacity-50"
                >
                  {{ loadingCancel === booking._id ? 'Cancelling...' : 'Cancel' }}
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Reschedule Modal -->
    <Teleport to="body">
      <div 
        v-if="showRescheduleModal" 
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeRescheduleModal"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            @click="closeRescheduleModal"
          ></div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900">Reschedule Booking</h3>
                <button 
                  @click="closeRescheduleModal"
                  class="text-gray-400 hover:text-gray-500"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div v-if="selectedBooking" class="mb-4 p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">
                  <span class="font-semibold">Service:</span> {{ selectedBooking.services[0]?.serviceName }}
                </p>
                <p class="text-sm text-gray-600 mt-1">
                  <span class="font-semibold">Current:</span> {{ formatDate(selectedBooking.preferredDate) }} at {{ selectedBooking.preferredStartTime }}
                </p>
              </div>

              <!-- Date Selection -->
              <div class="mb-6">
                <label class="block text-gray-700 font-semibold mb-2">New Date</label>
                <input 
                  type="date" 
                  v-model="rescheduleData.newPreferredDate" 
                  :min="minDate"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <!-- Time Slots Selection -->
              <div v-if="loadingAvailable" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>

              <div v-else-if="timeSlots.length > 0" class="mb-6">
                <h4 class="text-base font-semibold mb-3">Available Times</h4>
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                  <button 
                    v-for="(slot, index) in timeSlots" 
                    :key="index"
                    @click="selectRescheduleTime(slot)"
                    :class="[
                      'py-3 px-2 rounded-lg text-sm font-medium transition duration-200 border',
                      rescheduleData.newPreferredStartTime === slot.startTime 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:bg-pink-50'
                    ]"
                  >
                    {{ formatTime(slot.startTime) }}
                  </button>
                </div>
              </div>

              <div v-else-if="rescheduleData.newPreferredDate && !loadingAvailable" class="mb-6 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p class="text-gray-500">No available slots for this date.</p>
                <p class="text-sm text-gray-400 mt-1">Please select another date.</p>
              </div>

              <div v-else-if="!rescheduleData.newPreferredDate" class="mb-6 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p class="text-gray-500">Please select a date to view available time slots.</p>
              </div>

              <!-- Reason Input -->
              <div class="mb-6">
                <label class="block text-gray-700 font-semibold mb-2">Reason for Reschedule</label>
                <textarea 
                  v-model="rescheduleData.reason"
                  placeholder="Please provide a reason for rescheduling..."
                  rows="3"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                ></textarea>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
              <button 
                @click="handleReschedule"
                :disabled="!canSubmitReschedule || rescheduling"
                :class="[
                  'w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-3 font-bold text-base sm:ml-3 sm:w-auto sm:text-sm',
                  canSubmitReschedule && !rescheduling
                    ? 'bg-primary text-white hover:bg-pink-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                {{ rescheduling ? 'Rescheduling...' : 'Confirm Reschedule' }}
              </button>
              <button 
                @click="closeRescheduleModal"
                type="button"
                :disabled="rescheduling"
                class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useGetMyBookings } from '@/composables/modules/booking/useGetMyBookings'
import { useCancelBooking } from '@/composables/modules/booking/useCancelBooking'
import { useRescheduleBooking } from '@/composables/modules/booking/useRescheduleBooking'
import { useGetAvailableSlots } from '~/composables/modules/availability/useGetAvailableSlots'
import { useUser } from '@/composables/modules/auth/user'

const { loading, bookings, getMyBookings, error } = useGetMyBookings()
const { cancelBooking } = useCancelBooking()
const { loading: rescheduling, error: reschedulingError, rescheduleBooking } = useRescheduleBooking()
const { slots: availableSlots, loading: loadingAvailable, getAvailableSlots } = useGetAvailableSlots()
const { user } = useUser()

interface TimeSlot {
  startTime: string
  endTime: string
  duration: number
  availableStaff: any[]
  availableResources: any[]
  isBookable: boolean
}

definePageMeta({
  middleware: (to) => {
    const { token } = useUser()
    if (!token.value) return '/auth/login'
  }
})

// Time slots from getAvailableSlots
const timeSlots = computed(() => {
  const slots = availableSlots.value || []
  if (Array.isArray(slots)) {
    return slots.filter((slot: any) => slot.isBookable !== false)
  }
  return []
})

const minDate = computed(() => new Date().toISOString().split('T')[0])

const loadingCancel = ref<string | null>(null)

// Reschedule Modal State
const showRescheduleModal = ref(false)
const selectedBooking = ref<any>(null)
const rescheduleData = ref({
  newPreferredDate: '',
  newPreferredStartTime: '',
  reason: ''
})

// Computed to check if reschedule form is complete
const canSubmitReschedule = computed(() => {
  return rescheduleData.value.newPreferredDate && 
         rescheduleData.value.newPreferredStartTime && 
         rescheduleData.value.reason.trim().length > 0
})

// Helper to format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  })
}

// Helper to format time
const formatTime = (time: string) => {
  if (!time || typeof time !== 'string') return time
  
  const [hours, minutes] = time.split(':')
  if (!hours || !minutes) return time
  
  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// Logic to check if cancellation is allowed
const canCancel = (booking: any) => {
  if (booking.status === 'cancelled') return false
  return true
}

// Logic to check if rescheduling is allowed
const canReschedule = (booking: any) => {
  if (booking.status === 'cancelled') return false
  return true
}

// Fetch available slots for a specific date and service
const fetchAvailableSlots = async () => {
  if (!rescheduleData.value.newPreferredDate || !selectedBooking.value) return
  
  const serviceId = selectedBooking.value.services[0]?._id || selectedBooking.value.services[0]?.serviceId
  
  if (!serviceId) {
    console.error('No service ID found')
    return
  }

  await getAvailableSlots({
    businessId: selectedBooking.value.businessId._id,
    date: rescheduleData.value.newPreferredDate,
    serviceIds: [serviceId]
  })
}

// Open reschedule modal
const openRescheduleModal = (booking: any) => {
  selectedBooking.value = booking
  showRescheduleModal.value = true
  
  // Pre-populate with today's date
  const today = new Date().toISOString().split('T')[0]
  rescheduleData.value = {
    newPreferredDate: today,
    newPreferredStartTime: '',
    reason: ''
  }
}

// Close reschedule modal
const closeRescheduleModal = () => {
  if (rescheduling.value) return
  showRescheduleModal.value = false
  selectedBooking.value = null
  rescheduleData.value = {
    newPreferredDate: '',
    newPreferredStartTime: '',
    reason: ''
  }
}

// Select time slot for reschedule
const selectRescheduleTime = (slot: TimeSlot) => {
  rescheduleData.value.newPreferredStartTime = slot.startTime
}

// Handle reschedule submission
const handleReschedule = async () => {
  if (!selectedBooking.value || !canSubmitReschedule.value) return
  
  try {
    await rescheduleBooking(selectedBooking.value._id, {
      newPreferredDate: rescheduleData.value.newPreferredDate,
      newPreferredStartTime: rescheduleData.value.newPreferredStartTime,
      reason: rescheduleData.value.reason
    })
    
    closeRescheduleModal()
    await getMyBookings()
  } catch (e: any) {
    console.error('Reschedule error:', e)
  }
}

// Handle cancellation
const handleCancel = async (id: string) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  loadingCancel.value = id
  try {
    await cancelBooking(id, 'User requested cancellation')
    await getMyBookings()
  } catch (e: any) {
    console.error('Cancel error:', e)
  } finally {
    loadingCancel.value = null
  }
}

// AGGRESSIVE WATCHER - Fetch slots immediately when date changes
watch(
  () => rescheduleData.value.newPreferredDate,
  async (newDate) => {
    if (!newDate || !showRescheduleModal.value || !selectedBooking.value) return
    
    // Reset time selection
    rescheduleData.value.newPreferredStartTime = ''
    
    // Fetch slots immediately
    await fetchAvailableSlots()
  },
  { immediate: true }
)

// AGGRESSIVE WATCHER - Fetch slots when modal opens
watch(
  () => showRescheduleModal.value,
  async (isOpen) => {
    if (isOpen && rescheduleData.value.newPreferredDate && selectedBooking.value) {
      await fetchAvailableSlots()
    }
  },
  { immediate: true }
)

// Load bookings on mount
onMounted(() => {
  getMyBookings()
})
</script>