<template>
  <header 
    class="storefront-navbar"
    :class="{ 'navbar--scrolled': scrolled, 'navbar--transparent': config?.transparent }"
  >
    <nav class="container navbar-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="navbar-logo">
        <img 
          v-if="logo?.url" 
          :src="logo.url" 
          :alt="logo.alt || businessName"
          class="navbar-logo-img"
        />
        <span v-else class="navbar-logo-text">{{ businessName }}</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <ul class="navbar-links">
        <li v-for="link in navLinks" :key="link.id">
          <a :href="link.href" class="navbar-link">{{ link.label }}</a>
        </li>
      </ul>

      <!-- CTA Button -->
      <button class="btn-accent navbar-cta" @click="scrollToBooking">
        Book Now
      </button>

      <!-- Mobile Menu Toggle -->
      <button class="navbar-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
        <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="navbar-mobile">
      <ul class="navbar-mobile-links">
        <li v-for="link in navLinks" :key="link.id">
          <a :href="link.href" class="navbar-mobile-link" @click="mobileMenuOpen = false">
            {{ link.label }}
          </a>
        </li>
        <li>
          <button class="btn-accent w-full" @click="scrollToBooking">Book Now</button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  config?: any
  logo?: { url: string; alt?: string }
  businessName: string
}

const props = defineProps<Props>()

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = computed(() => [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'contact', label: 'Contact', href: '#contact' },
])

const scrollToBooking = () => {
  mobileMenuOpen.value = false
  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50
  })
})
</script>

<style scoped>
.storefront-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s;
  background: transparent;
}

.navbar--scrolled {
  background: var(--color-primary);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.navbar-logo-img {
  height: 40px;
  width: auto;
}

.navbar-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.navbar-links {
  display: none;
  list-style: none;
  gap: 2rem;
}

@media (min-width: 768px) {
  .navbar-links {
    display: flex;
  }
}

.navbar-link {
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-link:hover {
  color: var(--color-accent);
}

.navbar-cta {
  display: none;
}

@media (min-width: 768px) {
  .navbar-cta {
    display: block;
  }
}

.navbar-toggle {
  display: block;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

@media (min-width: 768px) {
  .navbar-toggle {
    display: none;
  }
}

.navbar-mobile {
  background: var(--color-primary);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-mobile-links {
  list-style: none;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.navbar-mobile-link {
  color: white;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
}
</style>
