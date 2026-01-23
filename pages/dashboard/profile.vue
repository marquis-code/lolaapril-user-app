<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Header -->
      <!-- <div class="mb-8">
        <h1 class="text-container text-lg font-bold text-gray-900">Profile Settings</h1>
        <p class="mt-2 text-gray-600">Manage your personal information and preferences</p>
      </div> -->

      <!-- Main Profile Card -->
      <div class="bg-white rounded-2xl shadow-sm border-[0.5px] border-gray-100 overflow-hidden">
        <!-- Cover Background -->
        <div class="h-32 bg-primary"></div>
        
        <!-- Profile Content -->
        <div class="px-6 sm:px-8 pb-8">
          <!-- Profile Picture Section -->
          <div class="relative -mt-16 mb-6">
            <div class="flex items-end justify-between">
              <div class="relative">
                <div
                  v-if="profilePreview || user?.profileImage"
                  class="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white"
                >
                  <img
                    :src="profilePreview || user?.profileImage"
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-32 h-32 rounded-2xl bg-primary flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-lg"
                >
                  {{ userInitials }}
                </div>
                
                <button
                  v-if="isEditMode"
                  @click="$refs.fileInput?.click()"
                  class="absolute -bottom-2 -right-2 bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:scale-105"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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

              <button
                @click="isEditMode = !isEditMode"
                class="px-6 py-2.5 rounded-xl font-medium transition-all"
                :class="isEditMode 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'"
              >
                {{ isEditMode ? 'Cancel' : 'Edit Profile' }}
              </button>
            </div>

            <div class="mt-4">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ user?.firstName }} {{ user?.lastName }}
              </h2>
              <p class="text-gray-600 mt-1">{{ user?.email }}</p>
            </div>
          </div>

          <!-- Form Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div class="space-y-2">
              <UiAnimatedInput
                v-model="formData.firstName"
                :disabled="!isEditMode"
                type="text"
                label="First Name"
                :class="!isEditMode && 'bg-gray-50 cursor-not-allowed'"
              />
            </div>

            <div class="space-y-2">
              <UiAnimatedInput
                v-model="formData.lastName"
                :disabled="!isEditMode"
                type="text"
                 label="Last Name"
                :class="!isEditMode && 'bg-gray-50 cursor-not-allowed'"
              />
            </div>

                        <div class="space-y-2">
              <UiSelectInput 
                :options="['male', 'female', 'other', 'prefer_not_to_say']" 
                v-model="formData.gender" 
                :disabled="!isEditMode"
                label="Gender"
                :class="!isEditMode && 'bg-gray-50 cursor-not-allowed'"
              />
            </div>

            <!-- <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Mobile Number</label>
              <UiAnimatedInput
                v-model="formData.phone"
                :disabled="!isEditMode"
                type="tel"
                label="Mobile number"
                :class="!isEditMode && 'bg-gray-50 cursor-not-allowed'"
              />
            </div> -->

            <div class="space-y-2">
              <UiAnimatedInput
                v-model="formData.email"
                disabled
                label="Email Address"
                type="email"
              />
            </div>

            <div class="space-y-2">
              <UiAnimatedInput
                v-model="formData.dateOfBirth"
                :disabled="!isEditMode"
                type="date"
                label="Date Of bIRTH"
                :class="!isEditMode && 'bg-gray-50 cursor-not-allowed'"
              />
            </div>

            <div class="space-y-2">
              <UiAnimatedInput
                v-model="formData.phone"
                :disabled="!isEditMode"
                type="tel"
                label="Mobile number"
                :class="!isEditMode && 'bg-gray-50 cursor-not-allowed'"
              />
            </div> 
          </div>

          <!-- Update Button -->
          <div v-if="isEditMode" class="mt-8 flex gap-4">
            <button
              @click="handleUpdateProfile"
              :disabled="loading"
              class="flex-1 bg-primary text-white font-semibold py-4 rounded-full text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {{ loading ? 'Updating...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="slide-up">
      <div
        v-if="showSuccess"
        class="fixed bottom-6 right-6 bg-primary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="font-medium">Profile updated successfully!</span>
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

// const { user, updateUser } = useUser()
const { user } = useGetProfile()
const { updateProfile } = useUpdateProfile()

const isEditMode = ref(false)
const loading = ref(false)
const showSuccess = ref(false)
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