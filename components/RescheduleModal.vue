<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          @click.self="closeModal"
        >
          <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-8">
            <!-- Close Button -->
            <button
              @click="closeModal"
              class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-6">Reschedule Booking</h3>

              <div v-if="booking" class="mb-6 p-4 bg-gray-25 rounded-lg border-[0.5px] border-gray-100">
                <h4 class="font-semibold text-gray-900 mb-2">Current Booking</h4>
                <div class="space-y-1 text-sm text-gray-600">
                  <p><span class="font-medium text-sm">Service:</span> {{ booking.services[0]?.serviceName }}</p>
                  <p><span class="font-medium text-sm">Date:</span> {{ formatDate(booking.preferredDate) }}</p>
                  <p><span class="font-medium text-sm">Time:</span> {{ booking.preferredStartTime }}</p>
                </div>
              </div>

              <!-- Date Selection -->
              <div class="mb-6">
                <UiAnimatedInput
                  type="date"
                  v-model="rescheduleData.newPreferredDate"
                  :min="minDate"
                  label="Select New Date"
                />
              </div>

              <!-- Loading State for Time Slots -->
              <div v-if="loadingAvailable" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>

              <!-- Time Slots -->
              <div v-else-if="timeSlots.length > 0" class="mb-6">
                <h4 class="text-gray-900 font-semibold mb-3">Available Time Slots</h4>
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
                  <button
                    v-for="(slot, index) in timeSlots"
                    :key="index"
                    @click="selectTime(slot)"
                    :class="[
                      'py-3 px-2 rounded-full text-sm font-medium transition-all border-[0.5px]',
                      rescheduleData.newPreferredStartTime === slot.startTime
                        ? 'bg-primary text-white border-primary shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary-50'
                    ]"
                  >
                    {{ formatTime(slot.startTime) }}
                  </button>
                </div>
              </div>

              <div v-else-if="rescheduleData.newPreferredDate && !loadingAvailable" class="mb-6 text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-600 font-medium">No available slots for this date</p>
                <p class="text-sm text-gray-500 mt-1">Please select another date</p>
              </div>

              <div v-else-if="!rescheduleData.newPreferredDate" class="mb-6 text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-gray-600">Select a date to view available time slots</p>
              </div>

              <!-- Reason Input -->
              <div class="mb-6">
                <UiAnimatedInput
                  v-model="rescheduleData.reason"
                  type="textarea"
                  label="Reason for Rescheduling"
                  :rows="3"
                  :cols="6"
                />
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <button
                  @click="closeModal"
                  :disabled="rescheduling"
                  class="flex-1 px-6 py-3.5 border text-sm border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="handleReschedule"
                  :disabled="!canSubmit || rescheduling"
                  :class="[
                    'flex-1 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all',
                    canSubmit && !rescheduling
                      ? 'bg-primary hover:bg-primary-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  ]"
                >
                  {{ rescheduling ? 'Rescheduling...' : 'Confirm Reschedule' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRescheduleBooking } from '@/composables/modules/booking/useRescheduleBooking'
import { useGetAvailableSlots } from '@/composables/modules/availability/useGetAvailableSlots'

const props = defineProps<{
  isOpen: boolean
  booking: any
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const { loading: rescheduling, rescheduleBooking } = useRescheduleBooking()
const { slots: availableSlots, loading: loadingAvailable, getAvailableSlots } = useGetAvailableSlots()

const rescheduleData = ref({
  newPreferredDate: '',
  newPreferredStartTime: '',
  reason: ''
})

const minDate = computed(() => new Date().toISOString().split('T')[0])

const timeSlots = computed(() => {
  const slots = availableSlots.value || []
  if (Array.isArray(slots)) {
    return slots.filter((slot: any) => slot.isBookable !== false)
  }
  return []
})

const canSubmit = computed(() => {
  return rescheduleData.value.newPreferredDate &&
    rescheduleData.value.newPreferredStartTime &&
    rescheduleData.value.reason.trim().length > 0
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
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

const selectTime = (slot: any) => {
  rescheduleData.value.newPreferredStartTime = slot.startTime
}

const fetchAvailableSlots = async () => {
  if (!rescheduleData.value.newPreferredDate || !props.booking) return

  const serviceId = props.booking.services[0]?._id || props.booking.services[0]?.serviceId

  if (!serviceId) {
    console.error('No service ID found')
    return
  }

  await getAvailableSlots({
    businessId: props.booking.businessId._id || props.booking.businessId,
    date: rescheduleData.value.newPreferredDate,
    serviceIds: [serviceId]
  })
}

const handleReschedule = async () => {
  if (!props.booking || !canSubmit.value) return

  try {
    await rescheduleBooking(props.booking._id, {
      newPreferredDate: rescheduleData.value.newPreferredDate,
      newPreferredStartTime: rescheduleData.value.newPreferredStartTime,
      reason: rescheduleData.value.reason
    })

    emit('success')
    closeModal()
  } catch (error: any) {
    console.error('Reschedule error:', error)
  }
}

const closeModal = () => {
  if (rescheduling.value) return
  emit('close')
  setTimeout(() => {
    rescheduleData.value = {
      newPreferredDate: '',
      newPreferredStartTime: '',
      reason: ''
    }
  }, 300)
}

watch(() => rescheduleData.value.newPreferredDate, async (newDate) => {
  if (!newDate || !props.isOpen || !props.booking) return
  rescheduleData.value.newPreferredStartTime = ''
  await fetchAvailableSlots()
})

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.booking) {
    const today = new Date().toISOString().split('T')[0]
    rescheduleData.value.newPreferredDate = today
  }
})

watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>