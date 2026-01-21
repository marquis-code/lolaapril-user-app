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
        <li>
          <button 
            @click="openLoginModal"
            class="hover:text-accent transition-colors"
          >
            Login
          </button>
        </li>
      </ul>

      <!-- Sign Up Button -->
      <button 
        @click="openSignupModal"
        class="hidden md:block btn-primary"
      >
        Sign Up
      </button>

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
      class="md:hidden bg-primary border-t border-white/10"
    >
      <ul class="flex flex-col space-y-4 px-6 py-6 text-white">
        <li><NuxtLink to="/" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Home</NuxtLink></li>
        <li><NuxtLink to="#services" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Services</NuxtLink></li>
        <li><NuxtLink to="#story" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Our Story</NuxtLink></li>
        <li><NuxtLink to="#gallery" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Gallery</NuxtLink></li>
        <li><NuxtLink to="#book" @click="mobileMenuOpen = false" class="block hover:text-accent transition-colors">Book Now</NuxtLink></li>
        <li>
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
      </ul>
    </div>

    <!-- Auth Modal -->
    <AuthModal 
      :is-open="authModalOpen"
      :initial-mode="authMode"
      @close="closeAuthModal"
    />
  </header>
</template>

<script setup lang="ts">
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const authModalOpen = ref(false)
const authMode = ref<'login' | 'signup'>('signup')

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
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
}
</script>