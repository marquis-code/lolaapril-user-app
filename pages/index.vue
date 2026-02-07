<template>
  <div>
    <TheHeader />
    <main>
      <ValentinesSpaModal />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <StorySection />
      <WhoWeAreSection />
      <GallerySection />
      <BookingSection @open-booking="openBookingModal" />
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

const router = useRouter()

const openBookingModal = () => {
  router.push('/book?subdomain=benn')
}
</script>