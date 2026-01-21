<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="closeModal"
        >
          <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <!-- Close Button -->
            <button
              @click="closeModal"
              class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="p-8">
              <!-- Warning Icon -->
              <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-2 text-center">Cancel Booking?</h3>
              <p class="text-gray-600 mb-6 text-center">Are you sure you want to cancel this booking? This action cannot be undone.</p>

              <div v-if="booking" class="mb-6 p-4 bg-gray-25 rounded-lg border-[0.5px] border-gray-100">
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Service:</span>
                    <span class="font-semibold text-gray-900">{{ booking.services[0]?.serviceName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Date:</span>
                    <span class="font-semibold text-gray-900">{{ formatDate(booking.preferredDate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Time:</span>
                    <span class="font-semibold text-gray-900">{{ booking.preferredStartTime }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Amount:</span>
                    <span class="font-semibold text-gray-900">₦{{ formatPrice(booking.totalAmount) }}</span>
                  </div>
                </div>
              </div>

              <!-- Reason Input -->
              <div class="mb-6">
                <UiAnimatedInput
                  v-model="cancelReason"
                  :rows="3"
                  :cols="6"
                  type="textarea"
                  label="Reason for Cancellation"
                />
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-6">
                <button
                  @click="closeModal"
                  :disabled="cancelling"
                  class="flex-1 px-6 py-3 border-[0.5px] text-sm border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  @click="handleCancel"
                  :disabled="!canSubmit || cancelling"
                  :class="[
                    'flex-1 px-6 py-3.5 rounded-full text-sm text-white transition-all',
                    canSubmit && !cancelling
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  ]"
                >
                  {{ cancelling ? 'Cancelling...' : 'Cancel Booking' }}
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
import { useCancelBooking } from '@/composables/modules/booking/useCancelBooking'

const props = defineProps<{
  isOpen: boolean
  booking: any
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const { cancelBooking } = useCancelBooking()

const cancelReason = ref('')
const cancelling = ref(false)

const canSubmit = computed(() => {
  return cancelReason.value.trim().length > 0
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

const formatPrice = (price: number) => {
  if (!price) return '0'
  return price.toLocaleString('en-NG')
}

const handleCancel = async () => {
  if (!props.booking || !canSubmit.value) return

  cancelling.value = true
  try {
    await cancelBooking(props.booking._id, cancelReason.value)
    emit('success')
    closeModal()
  } catch (error: any) {
    console.error('Cancel error:', error)
  } finally {
    cancelling.value = false
  }
}

const closeModal = () => {
  if (cancelling.value) return
  emit('close')
  setTimeout(() => {
    cancelReason.value = ''
  }, 300)
}

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