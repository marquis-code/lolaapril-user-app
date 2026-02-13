<!-- components/TheHeader.vue -->
<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-parentPrimary shadow-lg' : 'bg-transparent'"
  >
    <nav class="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center">
        <img src="@/assets/img/logo.png" alt="Lola April Wellness Spa Logo" class="h-10 w-auto" />
      </NuxtLink>


      <!-- Hamburger Menu Button (Desktop & Mobile) -->
      <div class="relative group">
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:flex items-center justify-center text-white focus:outline-none bg-parentPrimary/80 rounded-full p-2 shadow-lg transition-all duration-300 hover:bg-parentPrimary/90"
          style="box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12);"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Animated Sidebar (Partial Width, Full Height) -->
        <transition name="sidebar-fade">
          <div v-if="mobileMenuOpen" class="fixed inset-0 z-[1000] flex items-end sm:items-center justify-end" @click.self="mobileMenuOpen = false">
            <div class="h-full w-[90vw] sm:w-[420px] max-w-full bg-[#005967]/80 backdrop-blur-md flex flex-col items-center justify-center animate-sidebar-drawer shadow-2xl" @click.stop>
              <div class="w-full flex flex-col items-center pt-16 px-6">
              <ul class="flex flex-col space-y-6 text-white text-center text-2xl md:text-3xl font-light mb-8 w-full">
                <li><NuxtLink to="/" @click="mobileMenuOpen = false" class="hover:text-accent transition-colors">Home</NuxtLink></li>
                <li><NuxtLink to="#services" @click="mobileMenuOpen = false" class="hover:text-accent transition-colors">Services</NuxtLink></li>
                <li><NuxtLink to="#story" @click="mobileMenuOpen = false" class="hover:text-accent transition-colors">Our Story</NuxtLink></li>
                <li><NuxtLink to="#gallery" @click="mobileMenuOpen = false" class="hover:text-accent transition-colors">Gallery</NuxtLink></li>
                <li><NuxtLink to="#book" @click="handleBookNow" class="hover:text-accent transition-colors">Book Now</NuxtLink></li>
              </ul>
              <div class="w-full flex flex-col items-center">
                <template v-if="!isLoggedIn">
                  <button @click="openLoginModal" class="w-full mb-3 py-2 px-4 text-base text-white bg-accent rounded-full hover:opacity-90 transition font-medium">Login</button>
                  <button @click="openSignupModal" class="w-full py-2 px-4 text-base btn-parentPrimary font-medium">Sign Up</button>
                </template>
                <template v-else>
                  <div class="flex flex-col items-center w-full mb-3">
                    <div class="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-parentPrimary font-semibold text-xl mb-1">{{ userInitials }}</div>
                    <div class="text-white text-base font-semibold">{{ currentUser?.name }}</div>
                    <div class="text-white text-xs mb-1">{{ currentUser?.email }}</div>
                  </div>
                  <NuxtLink to="/dashboard/bookings" @click="mobileMenuOpen = false" class="w-full mb-2 py-2 px-4 text-base text-white bg-primary-600 rounded-full hover:bg-primary-700 transition text-center font-medium">My Bookings</NuxtLink>
                  <NuxtLink to="/dashboard/profile" @click="mobileMenuOpen = false" class="w-full mb-2 py-2 px-4 text-base text-white bg-primary-600 rounded-full hover:bg-primary-700 transition text-center font-medium">Profile</NuxtLink>
                  <button @click="handleLogoutClick" class="w-full py-2 px-4 text-base text-white bg-red-500 rounded-full hover:bg-red-600 transition font-medium">Logout</button>
                </template>
              </div>
            </div>
            <!-- Removed contact info section for cleaner sidebar -->
          </div>
          </div>
        </transition>
      </div>
    </nav>

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
                 <div class="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <svg
            class="w-7 h-7 text-rose-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
                <div class="flex  justify-center items-center flex-col">
                      <h3 class="text-xl font-semibold text-gray-900">
            Leaving already?
          </h3>
                       <p class="text-sm text-center text-gray-600 leading-relaxed">
            You’ll be signed out of your account.  
            Don’t worry — your appointments, favorites, and bookings will be waiting for you ✨
          </p>
                </div>
              <!-- </div> -->

              <div class="flex gap-3 justify-center w-full pt-4">
                <button 
                  @click="logoutModalOpen = false"
                  class="w-full px-4 py-3 rounded-full text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                   Stay logged in
                </button>
                <button 
                  @click="confirmLogout"
                  class="w-full px-4 py-3 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
                >
                  Log out
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
  const desktopDrawerOpen = ref(false)
  import { useUser } from '@/composables/modules/auth/user'
  import { useAnalytics } from '@/composables/useAnalytics'
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
const { trackEvent } = useAnalytics()


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
  if (typeof window !== "undefined") {
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
  if (scrolled.value && !scrolled.value) { // This is just to satisfy logic if needed, but let's just track once
     // trackEvent('scroll', 'The Header', 'scroll_scrolled')
  }
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
  trackEvent('click', 'The Header', 'signup_click')
  authMode.value = 'signup'
  authModalOpen.value = true
  mobileMenuOpen.value = false
}

const openLoginModal = () => {
  trackEvent('click', 'The Header', 'login_click')
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
  if (typeof window !== "undefined") {
    // Clear user from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token') // If you store token separately
    
    // Clear user state
    currentUser.value = null
    
    // Close modal
    logoutModalOpen.value = false
    
    trackEvent('click', 'The Header', 'logout_confirm')
    
    // Dispatch event for other components

    window.dispatchEvent(new Event('auth-change'))
    
    // Optional: Redirect to home
    navigateTo('/')
  }
}

const handleBookNow = () => {
  trackEvent('click', 'The Header', 'book_now_click')
  mobileMenuOpen.value = false
  navigateTo('/book?subdomain=lola-beauty')
}


</script>

<style scoped>
/* Fullscreen sidebar animation */

.animate-sidebar-drawer {
  animation: sidebarDrawerIn 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes sidebarDrawerIn {
  0% {
    opacity: 0;
    transform: translateX(100vw);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar-fade-enter-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-fade-enter-from {
  opacity: 0;
  transform: translateX(100vw);
}
.sidebar-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.sidebar-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.sidebar-fade-leave-to {
  opacity: 0;
  transform: translateX(100vw);
}
/* Animated drawer styles */
.animate-drawer {
  animation: drawerSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes drawerSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-24px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.slide-fade-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
}
.btn-parentPrimary {
  /* Equivalent Tailwind classes */
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: var(--color-accent);
  color: var(--color-parentPrimary);
  font-weight: 500;
  border-radius: 9999px;
  transition-property: opacity, background-color, color;
  transition-duration: 150ms;
}
@media (hover: hover) {
  .btn-parentPrimary:hover {
    opacity: 0.9;
  }
}
</style>