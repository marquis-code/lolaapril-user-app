<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Select Date & Time</h1>
      <p class="text-gray-600" v-if="selectedService">
        For {{ selectedService.basicDetails.serviceName }}
      </p>
    </div>

    <!-- Date Selection -->
    <div class="mb-8">
      <label class="block text-gray-700 font-bold mb-2">Date</label>
      <input 
        type="date" 
        v-model="dateInput" 
        :min="minDate"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        @change="handleDateChange"
      />
      
      <!-- Available dates info -->
      <div v-if="!loadingAll && summary" class="mt-3">
        <p class="text-sm text-gray-600">
          <span class="font-semibold">{{ summary.datesWithAvailability }}</span> dates available with 
          <span class="font-semibold">{{ availableDates.reduce((sum, d) => sum + d.availableSlotCount, 0) }}</span> total slots this month
        </p>
      </div>
    </div>

    <!-- Time Slots Selection -->
    <div v-if="loadingAvailable" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="timeSlots.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold mb-4">Available Times</h3>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <button 
          v-for="(slot, index) in timeSlots" 
          :key="index"
          @click="selectTime(slot)"
          :class="[
            'py-3 px-2 rounded-lg text-sm font-medium transition duration-200 border',
            selectedTime?.startTime === slot.startTime 
              ? 'bg-primary text-white border-primary shadow-md' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:bg-pink-50'
          ]"
        >
          {{ formatTime(slot.startTime) }}
        </button>
      </div>
    </div>

    <div v-else-if="dateInput && !loadingAvailable && dateWasSelected" class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500">No available slots for this date.</p>
      <p class="text-sm text-gray-400 mt-2">Please select another date.</p>
    </div>

    <div v-else-if="!dateInput" class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500">Please select a date to view available time slots.</p>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-between">
      <button 
        @click="router.back()"
        class="px-6 py-3 text-gray-600 font-medium hover:text-gray-800"
      >
        Back
      </button>
      
      <button 
        @click="proceed"
        :disabled="!selectedDate || !selectedTime"
        :class="[
          'px-8 py-3 rounded-lg font-bold shadow-md transition duration-200',
          selectedDate && selectedTime 
            ? 'bg-primary text-white  transform hover:scale-105' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingState } from '@/composables/modules/booking/useBookingState'
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'
import { useGetAvailableSlots } from '~/composables/modules/availability/useGetAvailableSlots'
import { useGetAllSlots } from '~/composables/modules/availability/useGetAllSlots'

interface AvailabilityDate {
  date: string
  hasSlots: boolean
  availableSlotCount: number
  totalSlots: number
  staffAvailable: number
}

interface TimeSlot {
  startTime: string
  endTime: string
  duration: number
  availableStaff: any[]
  availableResources: any[]
  isBookable: boolean
}

const { selectedService, selectedDate, selectedTime } = useBookingState()
const { business } = useGetBusiness()
const { slots: availableSlots, loading: loadingAvailable, getAvailableSlots } = useGetAvailableSlots()
const { slots: allSlots, loading: loadingAll, summary, getAllSlots } = useGetAllSlots()
const router = useRouter()
const route = useRoute()

// Local state
const dateInput = ref(selectedDate.value || '')
const dateWasSelected = ref(false)

// Parse availability data from getAllSlots
const availableDates = computed(() => {
  const dates = allSlots.value as unknown as AvailabilityDate[]
  if (!Array.isArray(dates)) return []
  return dates.filter(d => d.hasSlots && d.availableSlotCount > 0)
})

// Time slots are only from getAvailableSlots (for a specific date)
const timeSlots = computed(() => {
  const slots = availableSlots.value || []
  // Filter only bookable slots and extract time objects
  if (Array.isArray(slots)) {
    return slots.filter((slot: any) => slot.isBookable !== false)
  }
  return []
})

const minDate = computed(() => new Date().toISOString().split('T')[0])

// Helper to get start and end of month
const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  }
}

onMounted(async () => {
  if (!selectedService.value) {
    router.push({ path: '/book/services', query: route.query })
    return
  }

  if (!business.value) return

  // Load all available dates for the current month
  const today = new Date()
  const { startDate, endDate } = getMonthRange(today)
  
  await getAllSlots({
    subdomain: route.query.subdomain,
    startDate,
    endDate
  })

  // If there's a pre-selected date, fetch its time slots
  if (dateInput.value) {
    await fetchTimeSlotsForDate()
  }
})

const handleDateChange = async () => {
  if (!dateInput.value) return
  
  selectedDate.value = dateInput.value
  selectedTime.value = null // Reset time selection
  dateWasSelected.value = true

  await fetchTimeSlotsForDate()
}

const fetchTimeSlotsForDate = async () => {
  if (!dateInput.value || !selectedService.value || !business.value) return
  
  await getAvailableSlots({
    subdomain: route.query.subdomain,
    date: dateInput.value,
    serviceIds: [selectedService.value._id]
  })
}

const selectTime = (slot: TimeSlot) => {
  selectedTime.value = slot.startTime
}

const formatTime = (time: string) => {
  if (!time || typeof time !== 'string') return time
  
  const [hours, minutes] = time.split(':')
  if (!hours || !minutes) return time
  
  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const proceed = () => {
  if (selectedDate.value && selectedTime.value) {
    router.push({
      path: '/book/details',
      query: { subdomain: route.query.subdomain }
    })
  }
}
</script>