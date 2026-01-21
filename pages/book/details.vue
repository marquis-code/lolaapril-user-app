<template>
  <div class="max-w-2xl mx-auto p-4">
    <!-- Auth Modal Teleport -->
    <Teleport to="body" v-if="showAuthModal">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <button 
            @click="closeAuthModal"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          
          <!-- Tab Navigation -->
          <div class="flex gap-4 mb-6 border-b border-gray-200">
            <button
              @click="authTab = 'login'"
              :class="[
                'pb-2 font-medium transition',
                authTab === 'login' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              Login
            </button>
            <button
              @click="authTab = 'signup'"
              :class="[
                'pb-2 font-medium transition',
                authTab === 'signup' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              Sign Up
            </button>
          </div>

          <!-- Login Form -->
          <div v-if="authTab === 'login'">
            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">Email</label>
                <input 
                  v-model="loginForm.email"
                  type="email" 
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Password</label>
                <input 
                  v-model="loginForm.password"
                  type="password" 
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div v-if="loginError" class="text-red-500 text-sm">{{ loginError }}</div>
              <button 
                type="submit"
                :disabled="loginLoading"
                class="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loginLoading">Logging in...</span>
                <span v-else>Login</span>
              </button>
            </form>
          </div>

          <!-- Signup Form -->
          <div v-if="authTab === 'signup'">
            <form @submit.prevent="handleSignup" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-gray-700 font-medium mb-1">First Name</label>
                  <input 
                    v-model="signupForm.firstName"
                    type="text" 
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1">Last Name</label>
                  <input 
                    v-model="signupForm.lastName"
                    type="text" 
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Email</label>
                <input 
                  v-model="signupForm.email"
                  type="email" 
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input 
                  v-model="signupForm.phone"
                  type="tel" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="+234..."
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Password</label>
                <input 
                  v-model="signupForm.password"
                  type="password" 
                  required
                  minlength="6"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="••••••••"
                />
                <p class="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
              </div>
              <div v-if="signupError" class="text-red-500 text-sm">{{ signupError }}</div>
              <button 
                type="submit"
                :disabled="signupLoading"
                class="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="signupLoading">Creating Account...</span>
                <span v-else>Sign Up</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Main Booking Details Form -->
    <template v-if="isAuthenticated">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Your Details</h1>
        <p class="text-gray-600">Please provide your information to confirm the booking.</p>
      </div>

      <!-- Summary Card -->
      <div class="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
        <h3 class="font-bold text-gray-800 mb-2">Booking Summary</h3>
        <div class="flex justify-between mb-1">
          <span class="text-gray-600">Service:</span>
          <span class="font-medium">{{ selectedService?.basicDetails.serviceName }}</span>
        </div>
        <div class="flex justify-between mb-1">
          <span class="text-gray-600">Date:</span>
          <span class="font-medium">{{ formatDate(selectedDate) }}</span>
        </div>
        <div class="flex justify-between mb-1">
          <span class="text-gray-600">Time:</span>
          <span class="font-medium">{{ formatTime(selectedTime) }}</span>
        </div>
        <div class="border-t border-gray-300 my-2"></div>
        <div class="flex justify-between text-lg font-bold text-primary">
          <span>Total:</span>
          <span>{{ formatPrice(selectedService?.pricingAndDuration.price) }}</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleCreateBooking" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Full Name</label>
          <input 
            v-model="form.name"
            type="text" 
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label class="block text-gray-700 font-medium mb-1">Email Address</label>
          <input 
            v-model="form.email"
            type="email" 
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label class="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input 
            v-model="form.phone"
            type="tel" 
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="+234..."
          />
        </div>
        
        <div v-if="error" class="text-red-500 text-sm mt-2">
          {{ error }}
        </div>
        
        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-primary hover:bg-pink-600 text-white font-bold py-4 rounded-lg mt-6 shadow-md transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Proceed to Payment</span>
        </button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingState } from '@/composables/modules/booking/useBookingState'
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'
import { useCreateBooking } from '@/composables/modules/booking/useCreateBooking'
import { useLogin } from '@/composables/modules/auth/useLogin'
import { useRegister } from '@/composables/modules/auth/useRegister'

// Router setup
const router = useRouter()
const route = useRoute()

// Composables
const { selectedService, selectedDate, selectedTime, guestInfo, bookingDetails } = useBookingState()
const { business } = useGetBusiness()
const { createBooking, loading, error } = useCreateBooking()
const { login, loading: loginLoading, error: loginError } = useLogin()
const { register, loading: signupLoading, error: signupError } = useRegister()

// Auth state
const showAuthModal = ref(false)
const authTab = ref<'login' | 'signup'>('login')
const isAuthenticated = ref(false)
const currentUser = ref<any>(null)
const currentUserId = ref<string>('')

// Form states
const form = reactive({
  name: guestInfo.value.name || '',
  email: guestInfo.value.email || '',
  phone: guestInfo.value.phone || ''
})

const loginForm = reactive({
  email: '',
  password: ''
})

const signupForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'client' // Optional, defaults to client role
})

// Helper functions
const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''
const formatTime = (t: string | null) => {
  if (!t) return ''
  const [h, m] = t.split(':')
  const date = new Date()
  date.setHours(parseInt(h))
  date.setMinutes(parseInt(m))
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}
const formatPrice = (p: any) => p ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: p.currency }).format(p.amount) : ''

// Get client IP and user agent for tracking
const getTrackingInfo = () => {
  return {
    ipAddress: 'N/A', // Will be set by server if available
    userAgent: navigator.userAgent,
    sourceIdentifier: `BOOKING-WEB-${Date.now()}`
  }
}

// Get booking source based on how user arrived
const getBookingSource = () => {
  const tracking = getTrackingInfo()
  const sourceType = route.query.source || 'direct_link'
  
  return {
    sourceType: sourceType as string,
    sourceIdentifier: tracking.sourceIdentifier,
    channel: 'web',
    ipAddress: tracking.ipAddress,
    userAgent: tracking.userAgent
  }
}

// Auth state
const checkUserAuthentication = () => {
  try {
    const userDataStr = localStorage.getItem('user')
    const user = userDataStr ? JSON.parse(userDataStr) : null
    
    if (user && user.id) {
      currentUser.value = user
      currentUserId.value = user.id
      isAuthenticated.value = true
      
      // Pre-fill form with cached user info
      // user.name || form.name
      form.name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || form.name
      form.email = user.email || form.email
      form.phone = user.phone || form.phone
      
      showAuthModal.value = false
    } else {
      isAuthenticated.value = false
      showAuthModal.value = true
    }
  } catch (err) {
    console.error('Error checking authentication:', err)
    isAuthenticated.value = false
    showAuthModal.value = true
  }
}

// Form states
const handleLogin = async () => {
  try {
    const success = await login({
      email: loginForm.email,
      password: loginForm.password
    })
    
    if (success) {
      // User is set in useUser composable
      checkUserAuthentication()
      loginForm.email = ''
      loginForm.password = ''
    }
  } catch (err) {
    console.error('Login error:', err)
  }
}

const handleSignup = async () => {
  try {
    const result = await register({
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      phone: signupForm.phone,
      password: signupForm.password,
      role: signupForm.role
    })
    
    if (result) {
      // Auto-login after signup
      const loginSuccess = await login({
        email: signupForm.email,
        password: signupForm.password
      })
      
      if (loginSuccess) {
        checkUserAuthentication()
        signupForm.firstName = ''
        signupForm.lastName = ''
        signupForm.email = ''
        signupForm.phone = ''
        signupForm.password = ''
      }
    }
  } catch (err) {
    console.error('Signup error:', err)
  }
}

const closeAuthModal = () => {
  if (isAuthenticated.value) {
    showAuthModal.value = false
  }
}

const handleCreateBooking = async () => {
  if (!selectedService.value || !selectedDate.value || !selectedTime.value || !business.value) return
  
  // Persist guest info
  guestInfo.value = form

  try {
    const payload = {
      businessId: business.value._id,
      clientId: currentUserId.value || '507f1f77bcf86cd799439011', // Use authenticated user ID, fallback to placeholder
      clientName: form.name,
      clientEmail: form.email,
      clientPhone: form.phone,
      preferredDate: selectedDate.value,
      preferredStartTime: selectedTime.value,
      services: [{
        serviceId: selectedService.value._id,
        bufferTime: 0
      }],
      bookingSource: getBookingSource()
    }

    const data = await createBooking(payload)
    
    // Store booking details
    bookingDetails.value = {
        bookingId: data.bookingId,
        clientId: payload.clientId
    }
    
    router.push({
        path: `/book/payment/${data.bookingId}`,
        query: { subdomain: route.query.subdomain }
    })
    
  } catch (err: any) {
    console.error('Booking error:', err)
  }
}

// Check user authentication on mount
onMounted(() => {
  checkUserAuthentication()
})
</script>
