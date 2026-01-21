<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ bookings.length }}</dd>
        </div>
      </div>
      <!-- Add more stats if available -->
    </div>

    <!-- Profile Form -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
        <form @submit.prevent="handleUpdateProfile" class="mt-5 space-y-6">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">First name</label>
              <input v-model="form.firstName" type="text" class="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">Last name</label>
              <input v-model="form.lastName" type="text" class="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>

            <div class="col-span-6 sm:col-span-4">
              <label class="block text-sm font-medium text-gray-700">Email address</label>
              <input v-model="form.email" type="email" disabled class="mt-1 bg-gray-50 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
            
            <div class="col-span-6 sm:col-span-4">
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input v-model="form.phone" type="tel" class="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>
          
          <div class="flex justify-end">
            <button type="submit" :disabled="saving" class="bg-primary py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUpdateProfile } from '@/composables/modules/auth/useUpdateProfile'
import { useUser } from '@/composables/modules/auth/user'
import { useGetMyBookings } from '@/composables/modules/booking/useGetMyBookings'

const { updateProfile, loading: saving } = useUpdateProfile()
const { getMyBookings } = useGetMyBookings()
const { user } = useUser()

definePageMeta({
  middleware: (to) => {
    const { token } = useUser()
    if (!token.value) return '/auth/login'
  }
})

const bookings = ref<any[]>([])
const loading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

onMounted(async () => {
  if (user.value) {
    form.firstName = user.value.firstName
    form.lastName = user.value.lastName
    form.email = user.value.email
    form.phone = user.value.phone || '' 
  }
  
  // Fetch bookings for stats
  try {
     const res: any = await getMyBookings()
     bookings.value = res.data || []
  } catch (e) {
     bookings.value = []
  }
})

const handleUpdateProfile = async () => {
    await updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone
    })
    // User state updated in composable
}
</script>
