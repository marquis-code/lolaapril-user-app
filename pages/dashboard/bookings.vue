<template>
  <div class="min-h-screen pt-10">
    <div class="container mx-auto py-6 px-6">
      <!-- <h1 class="text-lg font-bold text-gray-900 mb-6">Appointments</h1> -->

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-parentPrimary"></div>
      </div>

      <div v-else-if="error" class="text-center py-8 bg-white rounded-xl border-[0.5px] border-gray-50">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-500 font-medium">Failed to load appointments</p>
        <p class="text-gray-500 text-sm mt-1">{{ error.message }}</p>
      </div>

      <div v-else>
        <!-- Filter Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <!-- Status Tabs -->
          <div class="flex items-center p-1 bg-gray-100/50 rounded-xl w-fit">
            <button 
              v-for="tab in ['Upcoming', 'Completed', 'Cancelled', 'All']" 
              :key="tab"
              @click="activeTab = tab"
              class="px-4 py-2 text-xs font-semibold rounded-lg transition-all"
              :class="activeTab === tab ? 'bg-white text-parentPrimary shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Custom Date Range Picker -->
          <div class="relative items-center gap-2">
            <button 
              @click="showDatePicker = !showDatePicker"
              class="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-parentPrimary/30 transition-all text-xs font-medium text-gray-700 min-w-[240px]"
            >
              <svg class="w-4 h-4 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ dateRangeText }}</span>
              <svg class="w-4 h-4 ml-auto text-gray-400 transition-transform" :class="{ 'rotate-180': showDatePicker }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Custom Calendar Popover -->
            <Transition name="fade-popover">
              <div v-if="showDatePicker" class="absolute top-full mt-2 left-0 md:right-0 md:left-auto z-[100] w-[320px] bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-5 overflow-hidden">
                <div class="flex items-center justify-between mb-4">
                  <button @click="prevMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 class="text-sm font-bold text-gray-900">{{ currentMonthYear }}</h3>
                  <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-7 gap-1 mb-2">
                  <div v-for="day in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="day" class="text-[10px] font-black text-gray-400 text-center uppercase py-1">
                    {{ day }}
                  </div>
                </div>

                <div class="grid grid-cols-7 gap-y-1">
                  <div 
                    v-for="(date, idx) in calendarDates" 
                    :key="idx"
                    class="relative py-2 flex items-center justify-center"
                  >
                    <!-- Range Background (Color Stroll) -->
                    <div 
                      v-if="isInRange(date)"
                      class="absolute inset-y-1 left-0 right-0 bg-parentPrimary/10"
                      :class="{ 
                        'rounded-l-full ml-1': isRangeStart(date),
                        'rounded-r-full mr-1': isRangeEnd(date)
                      }"
                    ></div>

                    <button
                      @click="handleDateClick(date)"
                      :disabled="!date.isCurrentMonth"
                      class="relative z-10 w-8 h-8 flex items-center justify-center text-xs font-medium rounded-full transition-all"
                      :class="[
                        !date.isCurrentMonth ? 'text-gray-200' : 'text-gray-700 hover:bg-gray-100',
                        isSelected(date) ? 'bg-parentPrimary text-white shadow-lg shadow-parentPrimary/30' : '',
                        date.isToday && !isSelected(date) ? 'text-parentPrimary font-bold border border-parentPrimary/20' : ''
                      ]"
                    >
                      {{ date.day }}
                    </button>
                  </div>
                </div>

                <div class="flex items-center shadow-lg border-t justify-between mt-6 pt-4 border-gray-100/50">
                  <button @click="clearDateRange" class="text-[11px] font-bold text-gray-400 hover:text-gray-600">Reset</button>
                  <button @click="showDatePicker = false" class="px-5 py-2 bg-parentPrimary text-white text-[11px] font-bold rounded-lg shadow-lg shadow-parentPrimary/20 hover:scale-105 active:scale-95 transition-all">Apply Filter</button>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Bookings List -->
        <div v-if="filteredBookings.length === 0" class="text-center py-12 bg-white rounded-xl border-[0.5px] border-gray-50">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-900 font-semibold mb-1">No {{ activeTab.toLowerCase() }} appointments found</p>
          <p class="text-gray-500 text-sm mb-4">Try adjusting your filters or status</p>
          <button
            @click="navigateTo('/#book')"
            class="inline-flex items-center text-sm gap-2 bg-gray-900 text-white font-medium px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Search salons
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="booking in filteredBookings"
            :key="booking._id"
            class="bg-white rounded-2xl border-[0.5px] border-gray-100 p-5 hover:border-parentPrimary/20 hover:shadow-md transition-all cursor-pointer group"
            @click="selectBooking(booking)"
          >
            <div class="flex items-start gap-4">
              <div class="relative">
                <img
                  src="@/assets/img/logo.png"
                  alt="Business"
                  class="w-14 h-14 p-2 bg-parentPrimary/10 rounded-2xl object-cover flex-shrink-0"
                />
                <span 
                  class="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white"
                  :class="getStatusColor(booking.status)"
                ></span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="font-bold text-gray-900 text-base truncate">
                    {{ booking.businessId?.businessName || booking.business?.name || 'Lola April Wellness Spa' }}
                  </h3>
                  <span class="text-xs font-bold text-gray-900">₦{{ formatPrice(booking.estimatedTotal) }}</span>
                </div>

                <!-- NEW: Specifically displaying Service Names -->
                <div class="flex flex-wrap gap-2 mb-2">
                  <span 
                    v-for="(service, sIdx) in booking.services" 
                    :key="sIdx"
                    class="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[10px] font-medium border border-gray-100"
                  >
                    {{ service.serviceName }}
                  </span>
                </div>

                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDateTime(booking.preferredDate, booking.preferredStartTime) }}
                  </div>
                  <span>•</span>
                  <span class="capitalize px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold tracking-tight">
                    {{ booking.status }}
                  </span>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <button
                  class="text-xs text-parentPrimary font-bold hover:text-parentPrimary-700 px-4 py-2 rounded-xl bg-parentPrimary/5 transition-all flex-shrink-0 group-hover:bg-parentPrimary group-hover:text-white"
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
                    <div v-for="date in rescheduleCalendarDates" :key="date.dateString || date.day" @click="selectRescheduleDate(date)" :class="['py-2 rounded-full cursor-pointer transition text-xs', !date.isCurrentMonth ? 'text-gray-300' : '', date.isToday ? 'font-bold' : '', date.dateString === rescheduleDate ? 'bg-parentPrimary text-white' : 'hover:bg-gray-100', !date.isAvailable ? 'opacity-50 cursor-not-allowed' : '']">
                      {{ date.day }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="rescheduleDate" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">New Time *</label>

              <div v-if="loadingRescheduleSlots" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-parentPrimary mx-auto"></div>
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
                <button v-for="slot in rescheduleTimeSlots" :key="slot.startTime" @click="selectRescheduleTime(slot.startTime)" :disabled="slot.isBooked" :class="['py-2.5 rounded-full text-xs font-medium transition border-[0.5px]', rescheduleTime === slot.startTime ? 'bg-parentPrimary text-white border-parentPrimary' : slot.isBooked ? 'bg-gray-50 text-gray-400 border-gray-50 cursor-not-allowed' : 'bg-white border-gray-300 hover:border-parentPrimary']">
                  {{ formatTime(slot.startTime) }}
                </button>
              </div>
            </div>

            <div class="mb-6">
              <UiAnimatedInput v-model="rescheduleReason" type="textarea" :rows="6" :cols="6" label="Reason for rescheduling *" />
            </div>

            <div class="flex gap-3">
              <button @click="closeRescheduleModal" class="flex-1 px-4  py-3 border-[0.5px] border-gray-50 rounded-full font-medium text-sm hover:bg-gray-25 transition-colors">Cancel</button>
              <button @click="handleRescheduleBooking" :disabled="!rescheduleDate || !rescheduleTime || !rescheduleReason.trim() || rescheduleLoading" class="flex-1 px-4 py-3 bg-parentPrimary text-white rounded-full font-medium text-sm hover:bg-parentPrimary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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

const activeTab = ref('Upcoming')
const showDatePicker = ref(false)
const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())
const dateRange = ref<{ start: string | null; end: string | null }>({ start: null, end: null })

const dateRangeText = computed(() => {
  if (!dateRange.value.start) return 'Select date range'
  const start = new Date(dateRange.value.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (!dateRange.value.end) return `${start} - ...`
  const end = new Date(dateRange.value.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${start} - ${end}`
})

const currentMonthYear = computed(() => {
  return new Date(calendarYear.value, calendarMonth.value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDates = computed(() => {
  const dates = []
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0)
  const today = new Date()
  today.setHours(0,0,0,0)

  let startDay = firstDay.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1

  const prevMonthLastDay = new Date(calendarYear.value, calendarMonth.value, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    dates.push({ day: prevMonthLastDay - i, date: null, isCurrentMonth: false })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(calendarYear.value, calendarMonth.value, i)
    dates.push({ 
      day: i, 
      date: date.toISOString().split('T')[0], 
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime()
    })
  }

  while (dates.length < 42) {
    dates.push({ day: dates.length - lastDay.getDate() - startDay + 1, date: null, isCurrentMonth: false })
  }
  return dates
})

const handleDateClick = (dateObj: any) => {
  if (!dateObj.date) return
  
  if (!dateRange.value.start || (dateRange.value.start && dateRange.value.end)) {
    dateRange.value.start = dateObj.date
    dateRange.value.end = null
  } else {
    // If user picks a date before the start date, make it the new start date
    if (new Date(dateObj.date) < new Date(dateRange.value.start)) {
      dateRange.value.start = dateObj.date
    } else {
      dateRange.value.end = dateObj.date
    }
  }
}

const isSelected = (dateObj: any) => dateObj.date === dateRange.value.start || dateObj.date === dateRange.value.end
const isRangeStart = (dateObj: any) => dateObj.date === dateRange.value.start
const isRangeEnd = (dateObj: any) => dateObj.date === dateRange.value.end
const isInRange = (dateObj: any) => {
  if (!dateRange.value.start || !dateRange.value.end || !dateObj.date) return false
  const d = new Date(dateObj.date)
  return d >= new Date(dateRange.value.start) && d <= new Date(dateRange.value.end)
}

const prevMonth = () => {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11
    calendarYear.value--
  } else calendarMonth.value--
}

const nextMonth = () => {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0
    calendarYear.value++
  } else calendarMonth.value++
}

const clearDateRange = () => {
  dateRange.value = { start: null, end: null }
}

const filteredBookings = computed(() => {
  let filtered = bookings.value

  // Status Filter
  const today = normalizeDate(new Date())
  if (activeTab.value === 'Upcoming') {
    filtered = filtered.filter((b: any) => {
      const bDate = normalizeDate(new Date(b.preferredDate))
      return bDate >= today && b.status?.toLowerCase() !== 'completed' && b.status?.toLowerCase() !== 'cancelled'
    })
  } else if (activeTab.value === 'Completed') {
    filtered = filtered.filter((b: any) => b.status?.toLowerCase() === 'completed')
  } else if (activeTab.value === 'Cancelled') {
    filtered = filtered.filter((b: any) => b.status?.toLowerCase() === 'cancelled')
  }

  // Date Range Filter
  if (dateRange.value.start) {
    const start = new Date(dateRange.value.start)
    filtered = filtered.filter((b: any) => new Date(b.preferredDate) >= start)
  }
  if (dateRange.value.end) {
    const end = new Date(dateRange.value.end)
    end.setHours(23, 59, 59, 999) // End of day
    filtered = filtered.filter((b: any) => new Date(b.preferredDate) <= end)
  }

  // Sort by date descending
  return filtered.sort((a, b) => new Date(b.preferredDate).getTime() - new Date(a.preferredDate).getTime())
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

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase()
  if (s === 'confirmed') return 'bg-green-500'
  if (s === 'pending') return 'bg-yellow-500'
  if (s === 'cancelled') return 'bg-red-500'
  if (s === 'completed') return 'bg-blue-500'
  return 'bg-gray-400'
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

/* Custom Date Picker Popover Animations */
.fade-popover-enter-active,
.fade-popover-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fade-popover-enter-from,
.fade-popover-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>