<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Profile Card -->
        <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div class="flex justify-between items-start mb-4 sm:mb-6">
            <div class="flex-1"></div>
            <button
              @click="isEditMode = !isEditMode"
              class="text-sm font-medium text-primary hover:text-primary-700"
            >
              {{ isEditMode ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <div class="flex flex-col items-center mb-6 sm:mb-8">
            <div class="relative mb-4">
              <div
                v-if="profilePreview || user?.profileImage"
                class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-100"
              >
                <img
                  :src="profilePreview || user?.profileImage"
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-600"
              >
                {{ userInitials }}
              </div>
              
              <button
                v-if="isEditMode"
                @click="$refs.fileInput?.click()"
                class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
            </div>
            
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
              {{ user?.firstName }} {{ user?.lastName }}
            </h2>
          </div>

          <div class="space-y-4 sm:space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First name</label>
              <input
                v-model="formData.firstName"
                :disabled="!isEditMode"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last name</label>
              <input
                v-model="formData.lastName"
                :disabled="!isEditMode"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mobile number</label>
              <input
                v-model="formData.phone"
                :disabled="!isEditMode"
                type="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="formData.email"
                disabled
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
              <input
                v-model="formData.dateOfBirth"
                :disabled="!isEditMode"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                v-model="formData.gender"
                :disabled="!isEditMode"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <button
              v-if="isEditMode"
              @click="handleUpdateProfile"
              :disabled="loading"
              class="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Updating...' : 'Update profile' }}
            </button>
          </div>
        </div>

        <!-- Addresses Card -->
        <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">My addresses</h3>

          <div class="space-y-4 mb-6">
            <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">Home</h4>
                <p class="text-sm text-gray-500">Add a home address</p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">Work</h4>
                <p class="text-sm text-gray-500">Add a work address</p>
              </div>
            </div>
          </div>

          <button
            @click="showAddAddressModal = true"
            class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="slide-up">
      <div
        v-if="showSuccess"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Profile updated successfully!
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/modules/auth/user'
import { useUpdateProfile } from '@/composables/modules/auth/useUpdateProfile'
import { useGetProfile }  from '@/composables/modules/auth/useGetProfile'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { user, updateUser } = useUser()
const { getProfile } = useGetProfile()
const { updateProfile } = useUpdateProfile()

const isEditMode = ref(false)
const loading = ref(false)
const showSuccess = ref(false)
const showAddAddressModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const profilePreview = ref('')

const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  profileImage: ''
})

const userInitials = computed(() => {
  if (!user.value) return 'U'
  const first = formData.value.firstName?.[0] || user.value.firstName?.[0] || ''
  const last = formData.value.lastName?.[0] || user.value.lastName?.[0] || ''
  return (first + last).toUpperCase()
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePreview.value = e.target?.result as string
      formData.value.profileImage = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleUpdateProfile = async () => {
  try {
    loading.value = true
    
    const updateData: any = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      phone: formData.value.phone,
      gender: formData.value.gender
    }

    if (formData.value.dateOfBirth) {
      updateData.dateOfBirth = formData.value.dateOfBirth
    }

    if (formData.value.profileImage) {
      updateData.profileImage = formData.value.profileImage
    }

    await updateProfile(updateData)
    
    showSuccess.value = true
    isEditMode.value = false
    
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    loading.value = false
  }
}

watch(user, (newUser) => {
  if (newUser) {
    formData.value = {
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      phone: newUser.phone || '',
      email: newUser.email || '',
      dateOfBirth: newUser.dateOfBirth ? new Date(newUser.dateOfBirth).toISOString().split('T')[0] : '',
      gender: newUser.gender || '',
      profileImage: newUser.profileImage || ''
    }
  }
}, { immediate: true })
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>