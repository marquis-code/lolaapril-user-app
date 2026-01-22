<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between p-4">
        <h2 class="text-lg font-semibold text-gray-900">{{ userDisplayName }}</h2>
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>

    <div class="flex">
      <!-- Desktop Sidebar -->
      <aside class="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ userDisplayName }}</h2>
        </div>
        
        <nav class="px-3 space-y-1">
          <NuxtLink
            to="/dashboard/profile"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/dashboard/profile') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </NuxtLink>

          <NuxtLink
            to="/dashboard/appointments"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/dashboard/appointments') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Appointments
          </NuxtLink>

          <NuxtLink
            to="/dashboard/wallet"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/dashboard/wallet') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Wallet
          </NuxtLink>

          <NuxtLink
            to="/dashboard/favorites"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/dashboard/favorites') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favorites
          </NuxtLink>

          <NuxtLink
            to="/dashboard/forms"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/dashboard/forms') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Forms
          </NuxtLink>

          <NuxtLink
            to="/dashboard/orders"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/dashboard/orders') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Product orders
          </NuxtLink>

          <NuxtLink
            to="/dashboard/settings"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/dashboard/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </NuxtLink>
        </nav>
      </aside>

      <!-- Mobile Menu Overlay -->
      <Transition name="overlay">
        <div
          v-if="showMobileMenu"
          class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          @click="showMobileMenu = false"
        ></div>
      </Transition>

      <!-- Mobile Sidebar -->
      <Transition name="slide">
        <aside
          v-if="showMobileMenu"
          class="lg:hidden w-64 bg-white min-h-screen fixed left-0 top-0 z-50"
        >
          <div class="p-6 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ userDisplayName }}</h2>
            <button
              @click="showMobileMenu = false"
              class="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav class="px-3 space-y-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive(item.path) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
              @click="showMobileMenu = false"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.label }}
            </NuxtLink>
          </nav>
        </aside>
      </Transition>

      <!-- Main Content -->
      <main class="flex-1 lg:ml-64">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/modules/auth/user'

const route = useRoute()
const { user } = useUser()
const showMobileMenu = ref(false)

const navItems = [
  { path: '/dashboard/profile', label: 'Profile', icon: 'IconProfile' },
  { path: '/dashboard/appointments', label: 'Appointments', icon: 'IconCalendar' },
  { path: '/dashboard/wallet', label: 'Wallet', icon: 'IconWallet' },
  { path: '/dashboard/favorites', label: 'Favorites', icon: 'IconHeart' },
  { path: '/dashboard/forms', label: 'Forms', icon: 'IconDocument' },
  { path: '/dashboard/orders', label: 'Product orders', icon: 'IconShoppingBag' },
  { path: '/dashboard/settings', label: 'Settings', icon: 'IconSettings' }
]

const userDisplayName = computed(() => {
  if (!user.value) return 'User'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email
})

const isActive = (path: string) => {
  return route.path === path
}

// Close mobile menu on route change
watch(() => route.path, () => {
  showMobileMenu.value = false
})
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>