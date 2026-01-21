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

          <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      @close="showBookingModal = false"
      @success="handleBookingSuccess"
    />
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Lola April Wellness Spa - Outside Health Starts Inside',
  meta: [
    { 
      name: 'description', 
      content: 'Premier destination for holistic rejuvenation in Lagos, Nigeria. Experience bespoke wellness with 24/7 spa services, Spa BnB, and transformative treatments.' 
    },
    {
      property: 'og:title',
      content: 'Lola April Wellness Spa - Your Sanctuary for Wellness'
    },
    {
      property: 'og:description',
      content: 'Transform your wellness journey with our holistic spa treatments, overnight retreats, and personalized care available 24/7.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'keywords',
      content: 'wellness spa Lagos, spa BnB Nigeria, holistic rejuvenation, luxury spa treatments, 24/7 spa services, Lekki spa'
    }
  ]
})

const showBookingModal = ref(false)

const openBookingModal = () => {
  showBookingModal.value = true
}

const handleBookingSuccess = () => {
  showBookingModal.value = false
  // Show success message or redirect
}
</script>