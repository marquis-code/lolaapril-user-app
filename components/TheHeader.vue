<!-- components/TheHeader.vue -->
<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-primary shadow-lg' : 'bg-transparent'"
  >
    <nav class="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center">
        <img src="@/assets/img/logo.png" alt="Lola April Wellness Spa Logo" class="h-10 w-auto" />
      </NuxtLink>

      <!-- Desktop Navigation -->
      <ul class="hidden md:flex items-center space-x-8 text-white">
        <li><NuxtLink to="/" class="hover:text-accent transition-colors">Home</NuxtLink></li>
        <li><NuxtLink to="#services" class="hover:text-accent transition-colors">Services</NuxtLink></li>
        <li><NuxtLink to="#story" class="hover:text-accent transition-colors">Our Story</NuxtLink></li>
        <li><NuxtLink to="#gallery" class="hover:text-accent transition-colors">Gallery</NuxtLink></li>
        <li><NuxtLink to="#book" class="hover:text-accent transition-colors">Book Now</NuxtLink></li>
        
        <!-- Show Login button only when not logged in -->
        <li v-if="!isLoggedIn">
          <button 
            @click="openLoginModal"
            class="hover:text-accent transition-colors"
          >
            Login
          </button>
        </li>
      </ul>

      <!-- Desktop Auth Section -->
      <div class="hidden md:flex items-center gap-4">
        <!-- Show Sign Up button only when not logged in -->
        <button 
          v-if="!isLoggedIn"
          @click="openSignupModal"
          class="btn-primary rounded-full"
        >
          Sign Up
        </button>

        <!-- Show User Profile when logged in -->
        <div v-else class="relative" ref="dropdownRef">
          <button 
            @click="toggleDropdown"
            class="flex items-center gap-2 text-white hover:text-accent transition-colors focus:outline-none"
          >
            <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-semibold">
              {{ userInitials }}
            </div>
            <svg 
              class="w-4 h-4 transition-transform"
              :class="dropdownOpen ? 'rotate-180' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-[0.5px] border-gray-50 py-2 z-50"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b-[0.5px] border-gray-100">
                <p class="text-sm font-semibold text-gray-900">{{ currentUser?.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ currentUser?.email }}</p>
              </div>

              <!-- Menu Items -->
              <NuxtLink 
                to="/bookings"
                @click="dropdownOpen = false"
                class="flex items-center text-sm gap-3 px-4 py-2 text-gray-700 hover:bg-gray-25 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                My Bookings
              </NuxtLink>

              <NuxtLink 
                to="/profile"
                @click="dropdownOpen = false"
                class="flex items-center text-sm gap-3 px-4 py-2 text-gray-700 hover:bg-gray-25 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </NuxtLink>

              <button 
                @click="handleLogoutClick"
                class="flex items-center text-sm gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-25 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden text-white focus:outline-none"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div 
      v-if="mobileMenuOpen"
      class="md:hidden bg-primary border-t-[0.5px] border-white/10"
    >
      <ul class="flex flex-col space-y-4 px-6 py-6 text-white">
        <!-- User Info (Mobile) - Show when logged in -->
        <li v-if="isLoggedIn" class="pb-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-semibold text-lg">
              {{ userInitials }}
            </div>
            <div>
              <p class="font-semibold">{{ currentUser?.name }}</p>
              <p class="text-xs text-gray-300">{{ currentUser?.email }}</p>
            </div>
          </div>
        </li>

        <li><NuxtLink to="/" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Home</NuxtLink></li>
        <li><NuxtLink to="#services" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Services</NuxtLink></li>
        <li><NuxtLink to="#story" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Our Story</NuxtLink></li>
        <li><NuxtLink to="#gallery" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Gallery</NuxtLink></li>
        <li><NuxtLink to="#book" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Book Now</NuxtLink></li>
        
        <!-- Show these only when logged in -->
        <template v-if="isLoggedIn">
          <li class="pt-4 border-t-[0.5px] border-white/10">
            <NuxtLink 
              to="/bookings" 
              @click="mobileMenuOpen = false" 
              class="flex items-center text-sm gap-3 hover:text-accent transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Bookings
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/profile" 
              @click="mobileMenuOpen = false" 
              class="flex items-center text-sm gap-3 hover:text-accent transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </NuxtLink>
          </li>
          <li>
            <button 
              @click="handleLogoutClick"
              class="flex items-center text-sm gap-3 text-red-400 hover:text-red-300 transition-colors w-full text-left"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </li>
        </template>

        <!-- Show these only when NOT logged in -->
        <template v-else>
          <li class="pt-4 border-t border-white/10">
            <button 
              @click="openLoginModal"
              class="block hover:text-accent transition-colors w-full text-left"
            >
              Login
            </button>
          </li>
          <li>
            <button 
              @click="openSignupModal"
              class="btn-primary w-full"
            >
              Sign Up
            </button>
          </li>
        </template>
      </ul>
    </div>

    <!-- Auth Modal -->
    <AuthModal 
      :is-open="authModalOpen"
      :initial-mode="authMode"
      @close="closeAuthModal"
    />

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="logoutModalOpen"
          class="fixed inset-0 z-[100] flex items-center backdrop-blur-sm justify-center bg-black/50 px-4"
          @click.self="logoutModalOpen = false"
        >
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="logoutModalOpen"
              class="bg-white rounded-lg shadow-xl flex justify-center space-y-6 items-center flex-col max-w-sm w-full p-6"
            >
              <!-- <div class="flex items-center gap-4 mb-4"> -->
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="flex  justify-center items-center flex-col">
                  <h3 class="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                  <p class="text-sm text-gray-600">Are you sure you want to logout?</p>
                </div>
              <!-- </div> -->

              <div class="flex gap-3 justify-center w-full pt-4">
                <button 
                  @click="logoutModalOpen = false"
                  class="px-4 py-2 w-full text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  @click="confirmLogout"
                  class="px-4 py-2 w-full text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
  import { useUser } from '@/composables/modules/auth/user'
  const { isLoggedIn, user: currentUser } = useUser()
interface User {
  id: string
  name: string
  email: string
  [key: string]: any
}

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const authModalOpen = ref(false)
const authMode = ref<'login' | 'signup'>('signup')
const dropdownOpen = ref(false)
const logoutModalOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// const currentUser = ref<User | null>(null)
// const isLoggedIn = computed(() => !!currentUser.value)

const userInitials = computed(() => {
  if (!currentUser.value?.firstName) return 'U'
  const names = currentUser.value.firstName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return currentUser.value.firstName.substring(0, 2).toUpperCase()
})

// Check for user in localStorage on mount
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  
  // Load user from localStorage
  checkAuthStatus()
  
  // Listen for auth changes (e.g., from AuthModal)
  window.addEventListener('auth-change', checkAuthStatus)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('auth-change', checkAuthStatus)
})

const checkAuthStatus = () => {
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        currentUser.value = JSON.parse(userStr)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        currentUser.value = null
      }
    } else {
      currentUser.value = null
    }
  }
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const openSignupModal = () => {
  authMode.value = 'signup'
  authModalOpen.value = true
  mobileMenuOpen.value = false
}

const openLoginModal = () => {
  authMode.value = 'login'
  authModalOpen.value = true
  mobileMenuOpen.value = false
}

const closeAuthModal = () => {
  authModalOpen.value = false
  checkAuthStatus() // Refresh user state after modal closes
}

const handleLogoutClick = () => {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  logoutModalOpen.value = true
}

const confirmLogout = () => {
  if (process.client) {
    // Clear user from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token') // If you store token separately
    
    // Clear user state
    currentUser.value = null
    
    // Close modal
    logoutModalOpen.value = false
    
    // Dispatch event for other components
    window.dispatchEvent(new Event('auth-change'))
    
    // Optional: Redirect to home
    navigateTo('/')
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-2 bg-accent text-primary font-medium rounded-full hover:bg-accent/90 transition-colors;
}
</style>