

// pages/book/index.vue
<template>
  <div>
    <BookingModal
      :is-open="isModalOpen"
      @close="handleClose"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const isModalOpen = ref(true)

const handleClose = () => {
  isModalOpen.value = false
  router.push('/')
}

const handleSuccess = () => {
  isModalOpen.value = false
  // Handle success (redirect to confirmation page, etc.)
}

// Open modal on mount
onMounted(() => {
  isModalOpen.value = true
})
</script>

// Or use it from the main landing page
// pages/index.vue (updated)
<template>
  <div>
    <TheHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <StorySection />
      <WhoWeAreSection />
      <GallerySection />
      <BookingSection @open-booking="openBookingModal" />
    </main>

    <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      @close="showBookingModal = false"
      @success="handleBookingSuccess"
    />
  </div>
</template>

<script setup lang="ts">
const showBookingModal = ref(false)

const openBookingModal = () => {
  showBookingModal.value = true
}

const handleBookingSuccess = () => {
  showBookingModal.value = false
  // Show success message or redirect
}
</script>

// Update BookingSection component to emit event
// components/BookingSection.vue (add emit)
<template>
  <section id="book" class="section-padding bg-primary text-white text-center">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-light mb-12">Book Now</h2>
      
      <div class="space-y-4 mb-12">
        <p class="text-lg">11B Rasheed Alaba Williams,</p>
        <p class="text-lg">Lekki Phase 1,</p>
        <p class="text-lg">Lagos, Nigeria</p>
        <p class="text-lg mt-6">T: +234 704 222 0934</p>
        <p class="text-lg">E: reservations@lolaapril.com</p>
      </div>

      <button @click="$emit('open-booking')" class="btn-primary text-lg">
        Reserve Your Experience
      </button>

      <!-- Social Media -->
      <div class="flex justify-center space-x-6 mt-12">
        <a href="#" class="hover:text-accent transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
        </a>
        <a href="#" class="hover:text-accent transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
        </a>
        <a href="#" class="hover:text-accent transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
          </svg>
        </a>
      </div>

      <p class="mt-12 text-sm">© 2025 Lola April.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits(['open-booking'])
</script>