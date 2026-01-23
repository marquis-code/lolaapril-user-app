<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-xl font-bold text-gray-900 mb-6">Settings</h1>

      <div class="space-y-4">
        <!-- Notifications Section -->
        <div class="bg-white rounded-xl border-[0.5px] border-gray-50 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-1">
            Notifications
          </h2>
          <p class="text-xs text-gray-500 mb-4">
            Manage your notification preferences
          </p>

          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                Appointments
              </h3>

              <div class="space-y-2">
                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-600">Text message</span>
                  <button
                    @click="toggleNotification('sms')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.sms ? 'bg-primary' : 'bg-gray-300',
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm',
                        notifications.sms ? 'translate-x-5' : 'translate-x-0.5',
                      ]"
                    />
                  </button>
                </div>

                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-600">WhatsApp</span>
                  <button
                    @click="toggleNotification('whatsapp')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.whatsapp ? 'bg-primary' : 'bg-gray-300',
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm',
                        notifications.whatsapp
                          ? 'translate-x-5'
                          : 'translate-x-0.5',
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Marketing</h3>

              <div class="space-y-2">
                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-600">Email</span>
                  <button
                    @click="toggleNotification('email')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.email ? 'bg-primary' : 'bg-gray-300',
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm',
                        notifications.email
                          ? 'translate-x-5'
                          : 'translate-x-0.5',
                      ]"
                    />
                  </button>
                </div>

                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-600">Text message</span>
                  <button
                    @click="toggleNotification('marketingSms')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.marketingSms ? 'bg-primary' : 'bg-gray-300',
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm',
                        notifications.marketingSms
                          ? 'translate-x-5'
                          : 'translate-x-0.5',
                      ]"
                    />
                  </button>
                </div>

                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-600">WhatsApp</span>
                  <button
                    @click="toggleNotification('marketingWhatsapp')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      notifications.marketingWhatsapp
                        ? 'bg-primary'
                        : 'bg-gray-300',
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm',
                        notifications.marketingWhatsapp
                          ? 'translate-x-5'
                          : 'translate-x-0.5',
                      ]"
                    />
                  </button>
                </div>
              </div>

              <p class="text-xs text-gray-400 mt-3 bg-gray-50 p-2 rounded">
                Reply START to opt back in if you previously unsubscribed
              </p>
            </div>
          </div>
        </div>

        <!-- Change Password Section -->
        <div class="bg-white rounded-xl border-[0.5px] border-gray-50 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-1">Password</h2>
          <p class="text-xs text-gray-500 mb-4">Update your account password</p>

          <button
            @click="showPasswordModal = true"
            class="w-full sm:w-auto bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Change Password
          </button>
        </div>

        <!-- Delete Account Section -->
        <div class="bg-white rounded-xl border border-red-100 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-1">
            Delete Account
          </h2>
          <p class="text-xs text-gray-500 mb-4">
            Permanently delete your account
          </p>

          <button
            @click="showDeleteModal = true"
            class="w-full sm:w-auto text-red-600 font-medium text-sm px-6 py-2.5 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <Transition name="modal">
      <div
        v-if="showPasswordModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
        @click.self="closePasswordModal"
      >
        <div
          class="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md sm:w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-semibold text-gray-900">Change Password</h3>
            <button
              @click="closePasswordModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <UiAnimatedInput
                v-model="passwordForm.currentPassword"
                type="password"
                label="Current Password"
                :error="passwordErrors.currentPassword"
              />
              <p
                v-if="passwordErrors.currentPassword"
                class="text-red-500 text-xs mt-1"
              >
                {{ passwordErrors.currentPassword }}
              </p>
            </div>

            <div>
              <UiAnimatedInput
                v-model="passwordForm.newPassword"
                type="password"
                label="New Password"
                :error="passwordErrors.newPassword"
              />
              <p
                v-if="passwordErrors.newPassword"
                class="text-red-500 text-xs mt-1"
              >
                {{ passwordErrors.newPassword }}
              </p>
              <div class="mt-2 space-y-1">
                <p
                  :class="[
                    'text-xs flex items-center gap-1.5',
                    passwordValidation.minLength
                      ? 'text-green-600'
                      : 'text-gray-400',
                  ]"
                >
                  <span class="text-base">{{
                    passwordValidation.minLength ? "✓" : "○"
                  }}</span>
                  At least 8 characters
                </p>
                <p
                  :class="[
                    'text-xs flex items-center gap-1.5',
                    passwordValidation.hasUpperCase
                      ? 'text-green-600'
                      : 'text-gray-400',
                  ]"
                >
                  <span class="text-base">{{
                    passwordValidation.hasUpperCase ? "✓" : "○"
                  }}</span>
                  One uppercase letter
                </p>
                <p
                  :class="[
                    'text-xs flex items-center gap-1.5',
                    passwordValidation.hasLowerCase
                      ? 'text-green-600'
                      : 'text-gray-400',
                  ]"
                >
                  <span class="text-base">{{
                    passwordValidation.hasLowerCase ? "✓" : "○"
                  }}</span>
                  One lowercase letter
                </p>
                <p
                  :class="[
                    'text-xs flex items-center gap-1.5',
                    passwordValidation.hasNumber
                      ? 'text-green-600'
                      : 'text-gray-400',
                  ]"
                >
                  <span class="text-base">{{
                    passwordValidation.hasNumber ? "✓" : "○"
                  }}</span>
                  One number
                </p>
                <p
                  :class="[
                    'text-xs flex items-center gap-1.5',
                    passwordValidation.notSameAsOld
                      ? 'text-green-600'
                      : 'text-gray-400',
                  ]"
                >
                  <span class="text-base">{{
                    passwordValidation.notSameAsOld ? "✓" : "○"
                  }}</span>
                  Different from current
                </p>
              </div>
            </div>

            <div>
              <UiAnimatedInput
                v-model="passwordForm.confirmPassword"
                type="password"
                label="Confirm New Password"
                :error="passwordErrors.confirmPassword"
              />
              <p
                v-if="passwordErrors.confirmPassword"
                class="text-red-500 text-xs mt-1"
              >
                {{ passwordErrors.confirmPassword }}
              </p>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              @click="closePasswordModal"
              class="flex-1 px-4 py-2.5 border-[0.5px] border-gray-50 text-sm rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleChangePassword"
              :disabled="loadingPassword || !isPasswordValid"
              class="flex-1 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loadingPassword ? "Updating..." : "Update" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Account Modal -->
    <Transition name="modal">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
        @click.self="showDeleteModal = false"
      >
        <div
          class="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md sm:w-full"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3"
            >
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Delete Account
            </h3>
            <p class="text-sm text-gray-600 mb-5">
              This will permanently delete your account and all data. This
              action cannot be undone.
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2.5 border-[0.5px] border-gray-50 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteAccount"
              :disabled="loadingDelete"
              class="flex-1 bg-red-600 text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loadingDelete ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Toast -->
    <!-- <Transition name="slide-up">
      <div
        v-if="showSuccess"
        class="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
      >
        <svg
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="text-sm font-medium">{{ successMessage }}</span>
      </div>
    </Transition> -->
  </div>
</template>

<script setup lang="ts">
import { useUser } from "@/composables/modules/auth/user";
import { useChangePassword } from "@/composables/modules/auth/useChangePassword";
import { useUpdateProfile } from "@/composables/modules/auth/useUpdateProfile";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { user, updateUserPreferences } = useUser();
const { changePassword } = useChangePassword();
const { loading, error, updateProfile } = useUpdateProfile();

const showPasswordModal = ref(false);
const showDeleteModal = ref(false);
const loadingPassword = ref(false);
const loadingDelete = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");

const notifications = ref({
  sms: true,
  whatsapp: true,
  email: true,
  marketingSms: true,
  marketingWhatsapp: true,
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordErrors = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Password validation computed property
const passwordValidation = computed(() => {
  const newPass = passwordForm.value.newPassword;
  const currentPass = passwordForm.value.currentPassword;

  return {
    minLength: newPass.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPass),
    hasLowerCase: /[a-z]/.test(newPass),
    hasNumber: /[0-9]/.test(newPass),
    notSameAsOld:
      newPass.length > 0 && currentPass.length > 0 && newPass !== currentPass,
  };
});

const isPasswordValid = computed(() => {
  return Object.values(passwordValidation.value).every((val) => val === true);
});

const closePasswordModal = () => {
  showPasswordModal.value = false;
  passwordForm.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  passwordErrors.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
};

const toggleNotification = async (type: string) => {
  notifications.value[type as keyof typeof notifications.value] =
    !notifications.value[type as keyof typeof notifications.value];

  // Save to backend using updateProfile composable
  try {
    await updateProfile({
      preferences: {
        ...(() => {
          const { _id, ...rest } = user.value?.preferences || {};
          return rest;
        })(),
        notifications: {
          email: notifications.value.email,
          sms: notifications.value.sms || notifications.value.marketingSms,
          push:
            notifications.value.whatsapp ||
            notifications.value.marketingWhatsapp,
        },
      },
    });

    successMessage.value = "Notification preferences updated";
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    // Revert the toggle on error
    notifications.value[type as keyof typeof notifications.value] =
      !notifications.value[type as keyof typeof notifications.value];
  }
};

const validatePasswordForm = (): boolean => {
  passwordErrors.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  let isValid = true;

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = "Current password is required";
    isValid = false;
  }

  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = "New password is required";
    isValid = false;
  } else if (!isPasswordValid.value) {
    passwordErrors.value.newPassword = "Password does not meet requirements";
    isValid = false;
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = "Please confirm your password";
    isValid = false;
  } else if (
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword
  ) {
    passwordErrors.value.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
    passwordErrors.value.newPassword =
      "New password must be different from current password";
    isValid = false;
  }

  return isValid;
};

const handleChangePassword = async () => {
  if (!validatePasswordForm()) {
    return;
  }

  try {
    loadingPassword.value = true;

    await changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });

    showPasswordModal.value = false;
    successMessage.value = "Password updated successfully!";
    showSuccess.value = true;

    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (error: any) {
    passwordErrors.value.currentPassword =
      error.message || "Failed to change password";
  } finally {
    loadingPassword.value = false;
  }
};

const handleDeleteAccount = async () => {
  try {
    loadingDelete.value = true;

    // Call your API to delete account
    // await deleteAccount()

    // Redirect to home
    navigateTo("/");
  } catch (error) {
    console.error("Failed to delete account:", error);
  } finally {
    loadingDelete.value = false;
  }
};

// Load user preferences on mount
onMounted(() => {
  if (user.value?.preferences?.notifications) {
    notifications.value = {
      sms: user.value.preferences.notifications.sms,
      whatsapp: user.value.preferences.notifications.push,
      email: user.value.preferences.notifications.email,
      marketingSms: user.value.preferences.notifications.sms,
      marketingWhatsapp: user.value.preferences.notifications.push,
    };
  }
});
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

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from .bg-white,
  .modal-leave-to .bg-white {
    transform: translateY(0) scale(0.95);
  }
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
