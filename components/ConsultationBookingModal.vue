<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b-[0.5px] border-gray-100 z-10 flex-shrink-0 safe-area-top"
      >
        <div
          class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto"
        >
          <button
            v-if="currentStep > 1"
            @click="goBack"
            class="p-2 hover:bg-gray-100 bg-gray-50 rounded-full transition flex-shrink-0 -ml-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div v-else class="w-9 sm:w-10 flex-shrink-0"></div>

          <div class="flex items-center space-x-1 sm:space-x-2 text-sm flex-1 justify-center px-2">
            <span :class="currentStep >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-400'">Packages</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span :class="currentStep >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-400'">Time</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span :class="currentStep >= 3 ? 'text-gray-900 font-semibold' : 'text-gray-400'">Confirm</span>
          </div>

          <button
            @click="close"
            class="p-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-full transition flex-shrink-0 -mr-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-hidden">
        <div class="max-w-7xl mx-auto h-full">
          <div class="lg:grid lg:grid-cols-3 lg:gap-8 lg:p-6 h-full">
            <!-- Left Content -->
            <div class="lg:col-span-2 p-4 sm:p-6 lg:p-0 pb-[100px] lg:pb-6 h-full overflow-y-auto">
              <!-- Step 1: Packages -->
              <div v-show="currentStep === 1">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">Select Package</h1>
                <p class="text-gray-600 mb-8">Choose a consultation package that fits your needs</p>

                <div v-if="loadingPackages" class="space-y-4">
                  <div v-for="i in 3" :key="i" class="h-32 bg-gray-50 rounded-2xl animate-pulse" />
                </div>

                <div v-else class="grid gap-4">
                  <div
                    v-for="pkg in packages"
                    :key="pkg._id"
                    @click="selectPackage(pkg)"
                    class="group relative bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all hover:border-parentPrimary/30"
                    :class="selectedPackage?._id === pkg._id ? 'border-parentPrimary bg-parentPrimary/[0.02]' : 'border-gray-100'"
                  >
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <h3 class="text-lg font-bold text-gray-900 group-hover:text-parentPrimary transition-colors">
                          {{ pkg.name }}
                        </h3>
                        <p class="text-gray-500 text-sm mt-1">{{ pkg.description }}</p>
                      </div>
                      <div class="text-right">
                        <div class="text-xl font-bold text-parentPrimary">{{ formatPrice(pkg.price) }}</div>
                        <div class="text-xs text-gray-400">{{ pkg.duration }} mins</div>
                      </div>
                    </div>
                    
                    <div  v-if="selectedPackage?._id === pkg._id" class="flex items-center gap-2 text-sm text-parentPrimary">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <!-- <svg class="w-4 h-4 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Expert Guidance -->
                    </div>

                    <!-- <div
                      v-if="selectedPackage?._id === pkg._id"
                      class="absolute top-4 right-4 text-parentPrimary"
                    >
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div> -->
                  </div>
                </div>
              </div>

              <!-- Step 2: Time Slots -->
              <div v-show="currentStep === 2">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">Choose Date & Time</h1>
                <p class="text-gray-600 mb-6">Select your preferred slot for the consultation</p>

                <!-- Custom Calendar Picker -->
                <div class="bg-gray-50 rounded-3xl p-6 mb-8">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-lg text-gray-900">{{ currentMonthYear }}</h3>
                    <div class="flex gap-2">
                      <button @click="previousMonth" class="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button @click="nextMonth" class="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-7 gap-2 text-center mb-2">
                    <div v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day" class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      {{ day }}
                    </div>
                  </div>

                  <div class="grid grid-cols-7 gap-2">
                    <button
                      v-for="date in calendarDates"
                      :key="date.dateString || Math.random()"
                      @click="date.isAvailable && selectDate(date.dateString)"
                      :disabled="!date.isAvailable"
                      class="aspect-square relative flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all"
                      :class="[
                        !date.isCurrentMonth ? 'opacity-20' : '',
                        date.isAvailable ? 'hover:bg-parentPrimary/10 cursor-pointer' : 'cursor-not-allowed opacity-30',
                        selectedDate === date.dateString ? 'bg-parentPrimary text-white shadow-lg shadow-parentPrimary/30' : 'bg-white text-gray-700 border border-gray-100'
                      ]"
                    >
                      {{ date.day }}
                      <div v-if="date.isToday && selectedDate !== date.dateString" class="absolute bottom-1.5 w-1 h-1 rounded-full bg-parentPrimary"></div>
                    </button>
                  </div>
                </div>

                <!-- Time Selection -->
                <div v-if="loadingSlots" class="grid grid-cols-3 gap-3">
                  <div v-for="i in 9" :key="i" class="h-12 bg-gray-50 rounded-xl animate-pulse" />
                </div>
                <div v-else-if="slots.length > 0">
                  <h3 class="font-bold text-gray-900 mb-4 px-1">Available Times</h3>
                  <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    <button
                      v-for="time in slots"
                      :key="time"
                      @click="selectedTime = time"
                      class="py-3 rounded-xl border-2 font-bold transition-all text-sm"
                      :class="selectedTime === time ? 'border-parentPrimary bg-parentPrimary text-white shadow-lg shadow-parentPrimary/20' : 'bg-white border-gray-100 hover:border-parentPrimary/30 text-gray-700'"
                    >
                      {{ formatTime(time) }}
                    </button>
                  </div>
                </div>
                <div v-else class="text-center py-12 bg-gray-50 rounded-3xl">
                  <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="font-bold text-gray-900">No slots available</p>
                  <p class="text-sm text-gray-500 mt-1">Please try another date or check back later.</p>
                </div>
              </div>

              <!-- Step 3: Confirm -->
              <div v-show="currentStep === 3">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h1>
                <p class="text-gray-600 mb-8">Review your consultation details</p>

                <div class="space-y-6">
                  <div class="bg-gray-50 rounded-3xl p-6">
                    <div class="flex items-center gap-4 mb-6">
                      <div class="w-12 h-12 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">{{ selectedPackage?.name }}</h3>
                        <p class="text-sm text-gray-500">{{ selectedPackage?.duration }} minutes</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Date</div>
                        <div class="font-bold text-gray-900">{{ formatDisplayDate(selectedDate) }}</div>
                      </div>
                      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Time</div>
                        <div class="font-bold text-gray-900">{{ formatTime(selectedTime) }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="px-2">
                    <UiAnimatedInput
                      v-model="notes"
                      label="Additional Notes (Optional)"
                      type="textarea"
                      placeholder="Briefly describe what you'd like to discuss..."
                      :rows="4"
                    />
                  </div>

                  <div class="flex items-center gap-4 p-5 bg-blue-50/50 border border-blue-100 text-blue-800 rounded-3xl text-sm leading-relaxed">
                    <div class="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span class="font-bold block mb-0.5">Payment Required</span>
                      A secure payment link via Paystack will be generated to secure your slot.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Sidebar -->
            <div class="hidden lg:block lg:col-span-1">
              <div class="sticky top-24 bg-gray-50 rounded-3xl p-8 h-fit">
                <h3 class="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
                
                <div class="space-y-4 mb-8">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Package</span>
                    <span class="font-bold text-gray-900">{{ selectedPackage?.name || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Duration</span>
                    <span class="font-bold text-gray-900">{{ selectedPackage ? selectedPackage.duration + ' mins' : '-' }}</span>
                  </div>
                  <div class="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span class="text-lg font-bold text-gray-900">Total</span>
                    <span class="text-2xl font-black text-parentPrimary">{{ formatPrice(selectedPackage?.price || 0) }}</span>
                  </div>
                </div>

                <button
                  @click="handleButtonClick"
                  :disabled="isButtonDisabled || bookingLoading"
                  class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                   <svg v-if="bookingLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ buttonText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Footer -->
      <div class="lg:hidden fixed bottom-6 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button
          @click="handleButtonClick"
          :disabled="isButtonDisabled || bookingLoading"
          class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <svg v-if="bookingLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ buttonText }} — {{ formatPrice(selectedPackage?.price || 0) }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGetConsultationPackages } from '@/composables/modules/consultation/useGetConsultationPackages'
import { useGetConsultationSlots } from '@/composables/modules/consultation/useGetConsultationSlots'
import { useBookConsultation } from '@/composables/modules/consultation/useBookConsultation'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  show: boolean
  subdomain: string
}>()

const emit = defineEmits(['close'])
const route = useRoute()
const { showToast } = useCustomToast()

const { loading: loadingPackages, packages, getPackages } = useGetConsultationPackages()
const { loading: loadingSlots, slots, getSlots } = useGetConsultationSlots()
const { loading: bookingLoading, bookConsultation } = useBookConsultation()

const currentStep = ref(1)
const selectedPackage = ref<any>(null)
const selectedDate = ref('')
const selectedTime = ref('')
const notes = ref('')

// Calendar state
const calendarMonth = ref(new Date().getMonth());
const calendarYear = ref(new Date().getFullYear());

const currentMonthYear = computed(() => {
  const date = new Date(calendarYear.value, calendarMonth.value);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
});

const calendarDates = computed(() => {
  const dates = [];
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1);
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dayOfWeek = firstDay.getDay();
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const prevMonthLastDay = new Date(
    calendarYear.value,
    calendarMonth.value,
    0
  ).getDate();
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    dates.push({
      day: prevMonthLastDay - i,
      dateString: "",
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
    });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(calendarYear.value, calendarMonth.value, i);
    const dateString = date.toISOString().split("T")[0];
    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;

    dates.push({
      day: i,
      dateString,
      isCurrentMonth: true,
      isToday,
      isAvailable: !isPast,
    });
  }

  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({
      day: i,
      dateString: "",
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
    });
  }

  return dates;
});

const buttonText = computed(() => {
  if (currentStep.value === 1) return 'Choose Package'
  if (currentStep.value === 2) return 'Pick Slot'
  if (currentStep.value === 3) return bookingLoading.value ? 'Confirming...' : 'Confirm & Pay'
  return 'Continue'
})

const isButtonDisabled = computed(() => {
  if (currentStep.value === 1) return !selectedPackage.value
  if (currentStep.value === 2) return !selectedTime.value
  return false
})

const selectPackage = (pkg: any) => {
  selectedPackage.value = pkg
}

const selectDate = async (date: string) => {
  if (!date) return
  selectedDate.value = date
  selectedTime.value = ''
  await getSlots(props.subdomain, date, selectedPackage.value._id)
}

const previousMonth = () => {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11;
    calendarYear.value--;
  } else {
    calendarMonth.value--;
  }
};

const nextMonth = () => {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0;
    calendarYear.value++;
  } else {
    calendarMonth.value++;
  }
};

const handleButtonClick = async () => {
  if (currentStep.value === 1) {
    currentStep.value = 2
    if (!selectedDate.value) {
      const today = new Date().toISOString().split('T')[0]
      await selectDate(today)
    }
  } else if (currentStep.value === 2) {
    currentStep.value = 3
  } else if (currentStep.value === 3) {
    await submitBooking()
  }
}

const submitBooking = async () => {
  const startTime = new Date(`${selectedDate.value}T${selectedTime.value}`)
  const payload = {
    packageId: selectedPackage.value._id,
    startTime: startTime.toISOString(),
    notes: notes.value
  }

  await bookConsultation(props.subdomain, payload)
  // if (res.success && res.data.checkoutUrl) {
  //   showToast({
  //       title: 'Booking Initiated',
  //       message: 'Redirecting to payment...',
  //       toastType: 'success'
  //   })
  //   window.location.href = res.data.checkoutUrl
  // } else {
  //   showToast({
  //     title: 'Booking Failed',
  //     message: res.error || 'Please try again later',
  //     toastType: 'error'
  //   })
  // }
}

const goBack = () => {
  if (currentStep.value > 1) currentStep.value--
}

const close = () => {
  currentStep.value = 1
  selectedPackage.value = null
  selectedDate.value = ''
  selectedTime.value = ''
  notes.value = ''
  emit('close')
}

const formatPrice = (price: number | any) => {
  const amount = typeof price === 'object' ? price.amount : price
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount || 0)
}

const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${minutes} ${ampm}`
}

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    getPackages(props.subdomain)
  }
})

onMounted(() => {
  if (props.show) {
    getPackages(props.subdomain)
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
