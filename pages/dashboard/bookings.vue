<template>
  <div class="min-h-screen">
    <div class="container mx-auto py-6 px-6">
      <!-- <h1 class="text-lg font-bold text-gray-900 mb-6">Appointments</h1> -->

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-8 bg-white rounded-xl border-[0.5px] border-gray-50">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-500 font-medium">Failed to load appointments</p>
        <p class="text-gray-500 text-sm mt-1">{{ error.message }}</p>
      </div>

      <div v-else>
        <!-- Upcoming Appointments -->
        <div class="mb-8">
          <h2 v-if="upcomingBookings.length" class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Upcoming
          </h2>

          <div v-if="upcomingBookings.length === 0" class="text-center py-12 bg-white rounded-xl border-[0.5px] border-gray-50">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-900 font-semibold mb-1">No upcoming appointments</p>
            <p class="text-gray-500 text-sm mb-4">Your upcoming appointments will appear here</p>
            <button
              @click="navigateTo('/#book')"
              class="inline-flex items-center text-sm gap-2 bg-gray-900 text-white font-medium px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Search salons
            </button>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="booking in upcomingBookings"
              :key="booking._id"
              class="bg-white rounded-xl border-[0.5px] border-gray-50 p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
              @click="selectBooking(booking)"
            >
              <div class="flex items-center gap-3">
                <img
                  src="@/assets/img/logo.png"
                  alt="Business"
                  class="w-12 h-12 p-1.5 bg-primary rounded-lg object-cover flex-shrink-0"
                />
                
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-sm mb-0.5 truncate">
                    {{ booking.business?.name || 'Lola April Wellness Spa' }}
                  </h3>
                  <p class="text-xs text-gray-600 mb-1">
                    {{ formatDateTime(booking.preferredDate, booking.preferredStartTime) }}
                  </p>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span class="font-medium text-gray-900">₦{{ formatPrice(booking.estimatedTotal) }}</span>
                    <span>•</span>
                    <span>{{ booking.services?.length || 1 }} service{{ booking.services?.length > 1 ? 's' : '' }}</span>
                  </div>
                </div>

                <button
                  class="text-xs text-primary font-semibold hover:text-primary-700 px-3 py-1.5 rounded-full bg-primary/5 transition-colors flex-shrink-0"
                  @click.stop="navigateTo('/book?subdomain=lola-beauty')"
                >
                  Book again
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Appointments -->
        <div v-if="pastBookings.length > 0">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Past ({{ pastBookings.length }})
          </h2>

          <div class="space-y-3">
            <div
              v-for="booking in pastBookings"
              :key="booking._id"
              class="bg-white rounded-xl border-[0.5px] border-gray-50 p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer opacity-90"
              @click="selectBooking(booking)"
            >
              <div class="flex items-center gap-3">
                <img
                  src="@/assets/img/logo.png"
                  alt="Business"
                  class="w-12 h-12 p-1.5 bg-gray-100 rounded-lg object-cover flex-shrink-0"
                />
                
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-sm mb-0.5 truncate">
                    {{ booking.business?.name || 'Lola April Wellness Spa' }}
                  </h3>
                  <p class="text-xs text-gray-600 mb-1">
                    {{ formatDateTime(booking.preferredDate, booking.preferredStartTime) }}
                  </p>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span class="font-medium text-gray-900">₦{{ formatPrice(booking.estimatedTotal) }}</span>
                    <span>•</span>
                    <span>{{ booking.services?.length || 1 }} service{{ booking.services?.length > 1 ? 's' : '' }}</span>
                  </div>
                </div>

                <button
                  class="text-xs text-primary font-medium hover:text-primary-700 px-3 py-1.5 rounded-full bg-primary/5 transition-colors flex-shrink-0"
                  @click.stop="navigateTo('/book?subdomain=lola-beauty')"
                >
                  Book again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Detail Modal -->
    <Transition name="modal">
      <div
        v-if="selectedBooking"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"
        @click.self="selectedBooking = null"
      >
        <div class="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <div class="relative h-40">
            <img
              src="@/assets/img/logo.png"
              alt="Business"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <button
              @click="selectedBooking = null"
              class="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 class="absolute bottom-3 left-4 text-xl font-bold text-white">
              {{ selectedBooking.business?.name || 'Lola April Wellness Spa' }}
            </h2>
          </div>

          <div class="px-5 py-3 border-b border-gray-100">
            <span
              :class="getStatusClass(selectedBooking.status)"
              class="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold"
            >
              {{ selectedBooking.status }}
            </span>
          </div>

          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-1">
              {{ formatDateTime(selectedBooking.preferredDate, selectedBooking.preferredStartTime) }}
            </h3>
            <p class="text-sm text-gray-600 mb-5">
              {{ selectedBooking.services?.[0]?.duration || 60 }} minute duration
            </p>

            <div class="flex gap-2 mb-6">
              <button
                v-if="isUpcoming(selectedBooking)"
                @click="openRescheduleModal"
                class="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Reschedule
              </button>
              <button
                v-if="isUpcoming(selectedBooking)"
                @click="openCancelModal"
                class="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                v-if="!isUpcoming(selectedBooking)"
                class="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                @click="navigateTo('/book?subdomain=lola-beauty')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Book again
              </button>
            </div>

            <div class="border-t border-gray-100 pt-5">
              <h4 class="font-bold text-gray-900 mb-3 text-sm">Overview</h4>
              
              <div class="space-y-2.5">
                <div
                  v-for="service in selectedBooking.services"
                  :key="service.serviceId"
                  class="flex justify-between items-start gap-3"
                >
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">{{ service.serviceName }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ service.duration || 60 }} min</p>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm">₦{{ formatPrice(service.price) }}</p>
                </div>
              </div>

              <div class="border-t border-gray-100 mt-4 pt-3 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-900">₦{{ formatPrice(selectedBooking.estimatedTotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="text-gray-900">₦{{ formatPrice(selectedBooking.estimatedTotal * 0.075) }}</span>
                </div>
                <div class="flex justify-between font-bold border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span>₦{{ formatPrice(selectedBooking.estimatedTotal * 1.075) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Cancel Modal -->
    <Teleport to="body">
      <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" @click.self="closeCancelModal">
        <div class="bg-white rounded-2xl max-w-md w-full">
          <div class="p-6">
            <h2 class="text-lg font-bold mb-2">Cancel Appointment</h2>
            <p class="text-gray-600 text-sm mb-6">Are you sure you want to cancel this appointment?</p>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation *</label>
              <UiAnimatedInput type="textarea" v-model="cancelReason" :rows="4" :cols="6" label="Reason for cancellation *"  />
            </div>

            <div class="flex gap-3">
              <button @click="closeCancelModal" class="flex-1 px-4 py-3 border-[0.5px] border-gray-50 rounded-lg font-medium text-sm hover:bg-gray-25 transition-colors">Keep Appointment</button>
              <button @click="handleCancelBooking" :disabled="!cancelReason.trim() || cancelLoading" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ cancelLoading ? 'Cancelling...' : 'Cancel Appointment' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reschedule Modal -->
    <Teleport to="body">
      <div v-if="showRescheduleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-[60]" @click.self="closeRescheduleModal">
        <div class="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
            <h2 class="text- font-bold">Reschedule Appointment</h2>
            <button @click="closeRescheduleModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="mb-6 p-4 bg-gray-25 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Current appointment</p>
              <p class="font-semibold text-gray-900">{{ formatDateTime(selectedBooking?.preferredDate, selectedBooking?.preferredStartTime) }}</p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">New Date *</label>
              <button @click="showRescheduleDatePicker = !showRescheduleDatePicker" class="w-full px-4 py-3 border-[0.5px] border-gray-100 rounded-xl flex items-center gap-2 hover:bg-gray-25 text-left">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-900">{{ formatDisplayDate(rescheduleDate) || 'Select new date' }}</span>
              </button>

              <div v-if="showRescheduleDatePicker" class="relative mt-2">
                <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-xl">
                  <div class="flex items-center justify-between mb-3">
                    <button @click="previousRescheduleMonth" class="p-2 hover:bg-gray-100 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 class="font-semibold text-sm">{{ rescheduleMonthYear }}</h3>
                    <button @click="nextRescheduleMonth" class="p-2 hover:bg-gray-100 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div class="grid grid-cols-7 gap-1 text-center">
                    <div v-for="day in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="day" class="text-xs text-gray-500 font-medium py-1">{{ day }}</div>
                    <div v-for="date in rescheduleCalendarDates" :key="date.dateString || date.day" @click="selectRescheduleDate(date)" :class="['py-2 rounded-full cursor-pointer transition text-xs', !date.isCurrentMonth ? 'text-gray-300' : '', date.isToday ? 'font-bold' : '', date.dateString === rescheduleDate ? 'bg-primary text-white' : 'hover:bg-gray-100', !date.isAvailable ? 'opacity-50 cursor-not-allowed' : '']">
                      {{ date.day }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="rescheduleDate" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">New Time *</label>

              <div v-if="loadingRescheduleSlots" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p class="text-sm text-gray-500 mt-2">Loading available times...</p>
              </div>

              <div v-else-if="rescheduleTimeSlots.length === 0" class="text-center py-8 bg-gray-25 rounded-lg">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm font-medium text-gray-700 mb-1">No available slots</p>
                <p class="text-xs text-gray-500">Please select a different date</p>
              </div>

              <div v-else class="grid grid-cols-3 gap-2">
                <button v-for="slot in rescheduleTimeSlots" :key="slot.startTime" @click="selectRescheduleTime(slot.startTime)" :disabled="slot.isBooked" :class="['py-2.5 rounded-full text-xs font-medium transition border-[0.5px]', rescheduleTime === slot.startTime ? 'bg-primary text-white border-primary' : slot.isBooked ? 'bg-gray-50 text-gray-400 border-gray-50 cursor-not-allowed' : 'bg-white border-gray-300 hover:border-primary']">
                  {{ formatTime(slot.startTime) }}
                </button>
              </div>
            </div>

            <div class="mb-6">
              <UiAnimatedInput v-model="rescheduleReason" type="textarea" :rows="6" :cols="6" label="Reason for rescheduling *" />
            </div>

            <div class="flex gap-3">
              <button @click="closeRescheduleModal" class="flex-1 px-4  py-3 border-[0.5px] border-gray-50 rounded-full font-medium text-sm hover:bg-gray-25 transition-colors">Cancel</button>
              <button @click="handleRescheduleBooking" :disabled="!rescheduleDate || !rescheduleTime || !rescheduleReason.trim() || rescheduleLoading" class="flex-1 px-4 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ rescheduleLoading ? 'Rescheduling...' : 'Reschedule' }}
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
import { useGetAvailableSlots } from '@/composables/modules/availability/useGetAvailableSlots'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { loading, bookings, getMyBookings, error } = useGetMyBookings()
const { loading: cancelLoading, cancelBooking } = useCancelBooking()
const { loading: rescheduleLoading, rescheduleBooking } = useRescheduleBooking()
const { slots: availableSlots, getAvailableSlots } = useGetAvailableSlots()

const normalizeDate = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const selectedBooking = ref<any>(null)
const showCancelModal = ref(false)
const cancelReason = ref('')
const showRescheduleModal = ref(false)
const rescheduleDate = ref<string | null>(null)
const rescheduleTime = ref<string | null>(null)
const rescheduleReason = ref('')
const showRescheduleDatePicker = ref(false)
const rescheduleMonth = ref(new Date().getMonth())
const rescheduleYear = ref(new Date().getFullYear())
const loadingRescheduleSlots = ref(false)

const upcomingBookings = computed(() => {
  const today = normalizeDate(new Date())
  return bookings.value.filter((booking: any) => {
    const bookingDate = normalizeDate(new Date(booking.preferredDate))
    const status = booking.status?.toLowerCase()
    return bookingDate >= today && status !== 'completed' && status !== 'cancelled'
  })
})

const pastBookings = computed(() => {
  const today = normalizeDate(new Date())
  return bookings.value.filter((booking: any) => {
    const bookingDate = normalizeDate(new Date(booking.preferredDate))
    const status = booking.status?.toLowerCase()
    return bookingDate < today || status === 'completed' || status === 'cancelled'
  })
})

const rescheduleMonthYear = computed(() => {
  const date = new Date(rescheduleYear.value, rescheduleMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const rescheduleCalendarDates = computed(() => {
  const dates = []
  const firstDay = new Date(rescheduleYear.value, rescheduleMonth.value, 1)
  const lastDay = new Date(rescheduleYear.value, rescheduleMonth.value + 1, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let dayOfWeek = firstDay.getDay()
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  const prevMonthLastDay = new Date(rescheduleYear.value, rescheduleMonth.value, 0).getDate()
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    dates.push({ day: prevMonthLastDay - i, dateString: '', isCurrentMonth: false, isToday: false, isAvailable: false })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(rescheduleYear.value, rescheduleMonth.value, i)
    const dateString = date.toISOString().split('T')[0]
    const isToday = date.getTime() === today.getTime()
    const isPast = date < today
    dates.push({ day: i, dateString, isCurrentMonth: true, isToday, isAvailable: !isPast })
  }

  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({ day: i, dateString: '', isCurrentMonth: false, isToday: false, isAvailable: false })
  }

  return dates
})

const rescheduleTimeSlots = computed(() => {
  if (!availableSlots.value) return []
  return availableSlots.value.map((slot: any) => ({ ...slot, isBooked: slot.isBookable === false }))
})

const formatDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.getFullYear()
  return `${dayName}, ${day} ${month} ${year} at ${timeStr}`
}

const formatPrice = (price: number) => {
  if (!price) return '0'
  return Math.round(price).toLocaleString('en-NG')
}

const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const formatDisplayDate = (dateString: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase()
  if (s === 'confirmed') return 'bg-green-100 text-green-700'
  if (s === 'pending') return 'bg-yellow-100 text-yellow-700'
  if (s === 'cancelled') return 'bg-red-100 text-red-700'
  if (s === 'completed') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-700'
}

const isUpcoming = (booking: any) => {
  if (!booking) return false
  const today = normalizeDate(new Date())
  const bookingDate = normalizeDate(new Date(booking.preferredDate))
  const status = booking.status?.toLowerCase()
  return bookingDate >= today && status !== 'completed' && status !== 'cancelled'
}

const selectBooking = (booking: any) => {
  selectedBooking.value = booking
}

const openCancelModal = () => {
  cancelReason.value = ''
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  cancelReason.value = ''
}

const handleCancelBooking = async () => {
  if (!selectedBooking.value || !cancelReason.value.trim()) return
  try {
    await cancelBooking(selectedBooking.value._id, cancelReason.value)
    closeCancelModal()
    selectedBooking.value = null
    await getMyBookings()
  } catch (err) {
    console.error('Error cancelling booking:', err)
  }
}

const openRescheduleModal = () => {
  if (!selectedBooking.value) return
  rescheduleDate.value = selectedBooking.value.preferredDate
  rescheduleTime.value = null
  rescheduleReason.value = ''
  showRescheduleDatePicker.value = false
  const bookingDate = new Date(selectedBooking.value.preferredDate)
  rescheduleMonth.value = bookingDate.getMonth()
  rescheduleYear.value = bookingDate.getFullYear()
  showRescheduleModal.value = true
  fetchRescheduleSlots()
}

const closeRescheduleModal = () => {
  showRescheduleModal.value = false
  rescheduleDate.value = null
  rescheduleTime.value = null
  rescheduleReason.value = ''
  showRescheduleDatePicker.value = false
}

const previousRescheduleMonth = () => {
  if (rescheduleMonth.value === 0) {
    rescheduleMonth.value = 11
    rescheduleYear.value--
  } else {
    rescheduleMonth.value--
  }
}

const nextRescheduleMonth = () => {
  if (rescheduleMonth.value === 11) {
    rescheduleMonth.value = 0
    rescheduleYear.value++
  } else {
    rescheduleMonth.value++
  }
}

const selectRescheduleDate = (date: any) => {
  if (date.isCurrentMonth && date.isAvailable) {
    rescheduleDate.value = date.dateString
    rescheduleTime.value = null
    showRescheduleDatePicker.value = false
    fetchRescheduleSlots()
  }
}

const selectRescheduleTime = (time: string) => {
  rescheduleTime.value = time
}

const fetchRescheduleSlots = async () => {
  if (!rescheduleDate.value || !selectedBooking.value) return
  console.log('Fetching slots for date:', selectedBooking.value)
  const serviceIds = selectedBooking.value.services?.map((s: any) => s.serviceId._id) || []
  if (serviceIds.length === 0) return

  loadingRescheduleSlots.value = true
  try {
    await getAvailableSlots({
      subdomain: selectedBooking.value.business?.subdomain || 'lola-beauty',
      date: rescheduleDate.value,
      serviceIds
    })
  } catch (err) {
    console.error('Error fetching reschedule slots:', err)
  } finally {
    loadingRescheduleSlots.value = false
  }
}

const handleRescheduleBooking = async () => {
  if (!selectedBooking.value || !rescheduleDate.value || !rescheduleTime.value || !rescheduleReason.value.trim()) return
  try {
    await rescheduleBooking(selectedBooking.value._id, {
      newPreferredDate: rescheduleDate.value,
      newPreferredStartTime: rescheduleTime.value,
      reason: rescheduleReason.value
    })
    closeRescheduleModal()
    selectedBooking.value = null
    await getMyBookings()
  } catch (err) {
    console.error('Error rescheduling booking:', err)
  }
}

watch(rescheduleDate, (newDate) => {
  if (newDate && showRescheduleModal.value) {
    rescheduleTime.value = null
    fetchRescheduleSlots()
  }
})

onMounted(() => {
  getMyBookings()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(0) scale(0.9);
  }
}
</style>