<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white -sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center">
          <img src="@/assets/img/logo.png" alt="Lola April Wellness Spa" class="h-10 w-auto" />
        </NuxtLink>
        
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-3 focus:outline-none"
          >
            <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {{ userInitials }}
            </div>
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Dropdown Menu -->
          <Transition name="dropdown">
            <div
              v-if="showUserMenu"
              v-click-outside="() => showUserMenu = false"
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg  py-2 z-50 border border-gray-100"
            >
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-semibold text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</p>
                <p class="text-sm text-gray-500">{{ user?.email }}</p>
              </div>
              
              <NuxtLink
                to="/profile"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </NuxtLink>
              
              <NuxtLink
                to="/bookings"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointments
              </NuxtLink>
              
              <button
                @click="openChangePasswordModal"
                class="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
              </button>
              
              <NuxtLink
                to="/settings"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </NuxtLink>
              
              <div class="border-t border-gray-100 mt-2 pt-2">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-lg font-bold text-gray-900 mb-8">My Bookings</h1>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-12 bg-white rounded-lg ">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-500 text-lg">Failed to load bookings</p>
        <p class="text-gray-500 mt-2">{{ error.message }}</p>
      </div>

      <div v-else-if="upcomingBookings.length === 0 && pastBookings.length === 0" class="text-center py-16 bg-white rounded-lg ">
        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500 text-lg mb-4">No appointments found</p>
        <p class="text-gray-400 mb-6">Your upcoming appointments will appear here when you book</p>
        <NuxtLink to="/#book" class="inline-block bg-primary hover:bg-primary-700 text-white font-semibold px-6 py-3.5 text-sm rounded-full transition-all">
          Book an Appointment
        </NuxtLink>
      </div>

      <div v-else class="space-y-8">
        <!-- Upcoming Bookings -->
        <div v-if="upcomingBookings.length > 0">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Upcoming</h2>
          <div class="grid gap-4">
            <div
              v-for="booking in upcomingBookings"
              :key="booking._id"
              class="bg-white rounded-lg border-[0.5px] border-gray-50 overflow-hidden hover:-md transition-"
            >
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        :class="getStatusClass(booking.status)"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ booking.status }}
                      </span>
                      <span class="text-sm text-gray-500">Ref: #{{ booking.bookingNumber }}</span>
                    </div>
                    <!-- {{ booking }} -->
                    
                    <h3 class="text-sm font-semibold text-gray-900 mb-2">
                      {{ booking.services[0]?.serviceName }}
                    </h3>
                    
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div class="flex text-xs items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(booking.preferredDate) }}
                      </div>
                      <div class="flex text-xs items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ booking.preferredStartTime }}
                      </div>
                      <div class="flex text-xs items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ booking.services[0]?.duration || 60 }} mins
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex flex-col items-end gap-2">
                    <span class="text-lg font-bold text-primary">₦{{ formatPrice(booking.estimatedTotal) }}</span>
                    <div class="flex gap-2">
                      <button
                        v-if="canReschedule(booking)"
                        @click="openRescheduleModal(booking)"
                        class="text-primary hover:text-primary-700 font-medium text-xs px-3 py-2 border border-primary rounded-full hover:bg-primary-50 transition-all"
                      >
                        Reschedule
                      </button>
                      <button
                        v-if="canCancel(booking)"
                        @click="openCancelModal(booking)"
                        :disabled="loadingCancel === booking._id"
                        class="text-red-600 hover:text-red-700 font-medium text-xs px-3 py-2 border border-red-600 rounded-full hover:bg-red-50 transition-all disabled:opacity-50"
                      >
                        {{ loadingCancel === booking._id ? 'Cancelling...' : 'Cancel' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Bookings -->
        <div v-if="pastBookings.length > 0">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Past ({{ pastBookings.length }})</h2>
          <div class="grid gap-4">
            <div
              v-for="booking in pastBookings"
              :key="booking._id"
              class="bg-white rounded-lg -sm border border-gray-200 overflow-hidden opacity-75"
            >
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        :class="getStatusClass(booking.status)"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ booking.status }}
                      </span>
                      <span class="text-sm text-gray-500">Ref: #{{ booking.bookingNumber }}</span>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                      {{ booking.services[0]?.serviceName }}
                    </h3>
                    
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(booking.preferredDate) }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ booking.preferredStartTime }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <span class="text-lg font-bold text-gray-700">₦{{ formatPrice(booking.estimatedTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <RescheduleModal
      :is-open="showRescheduleModal"
      :booking="selectedBooking"
      @close="closeRescheduleModal"
      @success="handleRescheduleSuccess"
    />

    <!-- Cancel Modal -->
    <CancelBookingModal
      :is-open="showCancelModal"
      :booking="selectedBooking"
      @close="closeCancelModal"
      @success="handleCancelSuccess"
    />

    <!-- Change Password Modal -->
    <ChangePasswordModal
      :is-open="showPasswordModal"
      @close="closePasswordModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useGetMyBookings } from '@/composables/modules/booking/useGetMyBookings'
import { useUser } from '@/composables/modules/auth/user'

definePageMeta({
  middleware: (to) => {
    const { token } = useUser()
    if (!token.value) return navigateTo('/')
  }
})

const { loading, bookings, getMyBookings, error } = useGetMyBookings()
const { user } = useUser()

const showUserMenu = ref(false)
const showRescheduleModal = ref(false)
const showCancelModal = ref(false)
const showPasswordModal = ref(false)
const selectedBooking = ref<any>(null)
const loadingCancel = ref<string | null>(null)

const userInitials = computed(() => {
  if (!user.value) return 'U'
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return (first + last).toUpperCase()
})

const upcomingBookings = computed(() => {
  return bookings.value.filter((booking: any) => {
    const bookingDate = new Date(booking.preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookingDate >= today && booking.status !== 'cancelled' && booking.status !== 'completed'
  })
})

const pastBookings = computed(() => {
  return bookings.value.filter((booking: any) => {
    const bookingDate = new Date(booking.preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookingDate < today || booking.status === 'completed' || booking.status === 'cancelled'
  })
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatPrice = (price: number) => {
  if (!price) return '0'
  return price.toLocaleString('en-NG')
}

const getStatusClass = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'confirmed') return 'bg-green-100 text-green-800'
  if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-800'
  if (statusLower === 'cancelled') return 'bg-red-100 text-red-800'
  if (statusLower === 'completed') return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

const canCancel = (booking: any) => {
  return booking.status !== 'cancelled' && booking.status !== 'completed'
}

const canReschedule = (booking: any) => {
  return booking.status !== 'cancelled' && booking.status !== 'completed'
}

const openRescheduleModal = (booking: any) => {
  selectedBooking.value = booking
  showRescheduleModal.value = true
  showUserMenu.value = false
}

const closeRescheduleModal = () => {
  showRescheduleModal.value = false
  selectedBooking.value = null
}

const handleRescheduleSuccess = async () => {
  closeRescheduleModal()
  await getMyBookings()
}

const openCancelModal = (booking: any) => {
  selectedBooking.value = booking
  showCancelModal.value = true
  showUserMenu.value = false
}

const closeCancelModal = () => {
  showCancelModal.value = false
  selectedBooking.value = null
}

const handleCancelSuccess = async () => {
  closeCancelModal()
  await getMyBookings()
}

const openChangePasswordModal = () => {
  showPasswordModal.value = true
  showUserMenu.value = false
}

const closePasswordModal = () => {
  showPasswordModal.value = false
}

// const handleLogout = () => {
//   clearUser()
//   navigateTo('/')
// }

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

onMounted(() => {
  getMyBookings()
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>