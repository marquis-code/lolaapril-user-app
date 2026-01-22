<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-xl font-bold text-gray-900 mb-8">Settings</h1>

      <div class="space-y-6">
        <!-- Notifications Section -->
        <div class="bg-white rounded-2xl border-[0.5px] border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-2">My notifications</h2>
          <p class="text-sm text-gray-500 mb-6">
            We will send you updates about your appointments, news and offers.
          </p>

          <div class="space-y-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-4">Appointment notifications</h3>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Text message</span>
                  <button
                    @click="toggleNotification('sms')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.sms ? 'bg-primary' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">WhatsApp</span>
                  <button
                    @click="toggleNotification('whatsapp')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.whatsapp ? 'bg-primary' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        notifications.whatsapp ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h3 class="font-semibold text-gray-900 mb-4">Marketing notifications</h3>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Email</span>
                  <button
                    @click="toggleNotification('email')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.email ? 'bg-primary' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        notifications.email ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Text message</span>
                  <button
                    @click="toggleNotification('marketingSms')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.marketingSms ? 'bg-primary' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        notifications.marketingSms ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">WhatsApp</span>
                  <button
                    @click="toggleNotification('marketingWhatsapp')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.marketingWhatsapp ? 'bg-primary' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        notifications.marketingWhatsapp ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <p class="text-xs text-gray-500 mt-4">
                If you previously opted out to text messages by texting STOP, please reply with START to opt back in.
              </p>
            </div>
          </div>
        </div>

        <!-- Change Password Section -->
        <div class="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Change password</h2>
          <p class="text-sm text-gray-500 mb-6">Update your Fresha password</p>

          <button
            @click="showPasswordModal = true"
            class="bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Update my password
          </button>
        </div>

        <!-- Delete Account Section -->
        <div class="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Delete account</h2>
          <p class="text-sm text-gray-500 mb-6">Are you sure you want to leave Fresha?</p>

          <button
            @click="showDeleteModal = true"
            class="text-red-600 font-semibold text-sm px-6 py-3 border-2 border-red-600 rounded-full hover:bg-red-50 transition-colors"
          >
            Delete my account
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <Transition name="modal">
      <div
        v-if="showPasswordModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showPasswordModal = false"
      >
        <div class="bg-white rounded-2xl p-8 max-w-md w-full">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>

          <div class="space-y-4">
            <div>
              <UiAnimatedInput
                v-model="passwordForm.currentPassword"
                type="password"
                label="Current Password"
              />
            </div>

            <div>
              <UiAnimatedInput
                v-model="passwordForm.newPassword"
                type="password"
                label="New Password"
              />
            </div>

            <div>
              <UiAnimatedInput
                v-model="passwordForm.confirmPassword"
                type="password"
                label="Confirm New Password"
              />
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              @click="showPasswordModal = false"
              class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleChangePassword"
              :disabled="loadingPassword"
              class="flex-1 bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {{ loadingPassword ? 'Updating...' : 'Update' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Account Modal -->
    <Transition name="modal">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-2xl p-8 max-w-md w-full">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Delete Account</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>

          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteAccount"
              :disabled="loadingDelete"
              class="flex-1 bg-red-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ loadingDelete ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition name="slide-up">
      <div
        v-if="showSuccess"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        {{ successMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/modules/auth/user'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { user, updateUserPreferences } = useUser()

const showPasswordModal = ref(false)
const showDeleteModal = ref(false)
const loadingPassword = ref(false)
const loadingDelete = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')

const notifications = ref({
  sms: true,
  whatsapp: true,
  email: true,
  marketingSms: true,
  marketingWhatsapp: true
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const toggleNotification = async (type: string) => {
  notifications.value[type as keyof typeof notifications.value] = !notifications.value[type as keyof typeof notifications.value]
  
  // Save to backend
  try {
    await updateUserPreferences({
      notifications: {
        email: notifications.value.email,
        sms: notifications.value.sms || notifications.value.marketingSms,
        push: notifications.value.whatsapp || notifications.value.marketingWhatsapp
      }
    })
  } catch (error) {
    console.error('Failed to update notification preferences:', error)
  }
}

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  try {
    loadingPassword.value = true
    
    // Call your API to change password
    // await changePassword(passwordForm.value)
    
    showPasswordModal.value = false
    successMessage.value = 'Password updated successfully!'
    showSuccess.value = true
    
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    loadingPassword.value = false
  }
}

const handleDeleteAccount = async () => {
  try {
    loadingDelete.value = true
    
    // Call your API to delete account
    // await deleteAccount()
    
    // Redirect to home
    navigateTo('/')
  } catch (error) {
    console.error('Failed to delete account:', error)
  } finally {
    loadingDelete.value = false
  }
}

// Load user preferences on mount
onMounted(() => {
  if (user.value?.preferences?.notifications) {
    notifications.value = {
      sms: user.value.preferences.notifications.sms,
      whatsapp: user.value.preferences.notifications.push,
      email: user.value.preferences.notifications.email,
      marketingSms: user.value.preferences.notifications.sms,
      marketingWhatsapp: user.value.preferences.notifications.push
    }
  }
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
}

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