<template>
  <section id="services" class="section-padding bg-white">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-light text-center text-parentPrimary mb-4">
        Our Key Offerings
      </h2>
      <p class="text-center max-w-3xl mx-auto text-lg text-parentPrimary/70 mb-12">
        Achieve your self-care goals more effortlessly than ever with our extensive selection of 
        <span class="underline decoration-accent">thoughtfully curated services</span> and our invaluable 
        <span class="underline decoration-accent">Spa Membership package</span>.
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard 
          v-for="service in services" 
          :key="service.slug"
          :title="service.title"
          :image="service.image"
          @click="onServiceClick(service)"
          class="cursor-pointer"
        />
      </div>

      <MobileSpaModal
        v-if="showMobileSpaModal"
        :show="showMobileSpaModal"
        :googleApiKey="googleApiKey"
        @close="showMobileSpaModal = false"
        @submitted="onMobileSpaSubmitted"
      />

      <ConsultationBookingModal
        v-if="showConsultationModal"
        :show="showConsultationModal"
        subdomain="lola-beauty"
        @close="showConsultationModal = false"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import spa13 from '@/assets/img/spa8.jpg'
import waxing from '@/assets/img/waxing.jpg'
import spa10 from '@/assets/img/spa12.jpg'
import spa11 from '@/assets/img/spa11.jpg'
import { ref } from 'vue'

interface Service {
  title: string
  slug: string
  image: string
}

const services: Service[] = [
  {
    title: 'Spa BnB Experience',
    slug: 'spa-bnb-experience',
    image: spa13
  },
  {
    title: 'Mobile Spa',
    slug: 'mobile-spa',
    image: waxing
  },
  {
    title: 'Spa Services',
    slug: 'spa-services',
    image: spa10
  },
  {
    title: 'Spa Management Services',
    slug: 'spa-management-services',
    image: spa11
  }
]

const showMobileSpaModal = ref(false)
const showConsultationModal = ref(false)
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY

function onServiceClick(service: Service) {
  if (service.slug === 'mobile-spa') {
    showMobileSpaModal.value = true
  } else if (service.slug === 'spa-management-services') {
    showConsultationModal.value = true
  } else {
    navigateTo({
      path: '/book',
      query: {
        subdomain: 'lola-beauty',
        service: service.slug,
      },
    })
  }
}

function onMobileSpaSubmitted() {
  // Optionally show a toast or reload data
}
</script>